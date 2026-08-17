import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseConfigured, memoryStore } from '../config/supabase.js';
import { CreateBookingPayload, Booking, BookingRentalItem, BookingWashItem, Car, WashService } from '../types/index.js';
import { NotificationService } from './notificationService.js';

export class BookingService {
  /**
   * Helper to generate unique booking ID format: AG-YYYY-XXXXX
   */
  public static generateBookingNumber(): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `AG-${year}-${randomNum}`;
  }

  /**
   * Calculate rental days between pickup and return dates
   */
  public static calculateRentalDays(pickupDateStr: string, returnDateStr: string): number {
    const pDate = new Date(pickupDateStr);
    const rDate = new Date(returnDateStr);
    const diffTime = rDate.getTime() - pDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }

  /**
   * Check for car rental date overlaps
   */
  public static async isCarAvailable(
    carId: string,
    pickupDate: string,
    returnDate: string
  ): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('booking_items')
        .select('pickup_date, return_date, booking_id, bookings(status)')
        .eq('car_id', carId)
        .neq('bookings.status', 'Cancelled');

      if (error) {
        console.error('[BookingService] Car availability check error:', error);
        return false;
      }

      const pDate = new Date(pickupDate).getTime();
      const rDate = new Date(returnDate).getTime();

      for (const item of data || []) {
        const itemP = new Date(item.pickup_date).getTime();
        const itemR = new Date(item.return_date).getTime();
        // Check range overlap: (pDate <= itemR) and (rDate >= itemP)
        if (pDate <= itemR && rDate >= itemP) {
          return false;
        }
      }
      return true;
    } else {
      // Memory Store Check
      const pDate = new Date(pickupDate).getTime();
      const rDate = new Date(returnDate).getTime();

      for (const b of memoryStore.bookings) {
        if (b.status === 'Cancelled') continue;
        if (b.rental_item && b.rental_item.car_id === carId) {
          const itemP = new Date(b.rental_item.pickup_date).getTime();
          const itemR = new Date(b.rental_item.return_date).getTime();
          if (pDate <= itemR && rDate >= itemP) {
            return false;
          }
        }
      }
      return true;
    }
  }

  /**
   * Check for car wash time slot capacity
   */
  public static async isWashSlotAvailable(
    serviceId: string,
    washDate: string,
    timeSlot: string
  ): Promise<boolean> {
    const maxCapacity = memoryStore.businessSettings.max_wash_bookings_per_slot || 3;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('booking_items')
        .select('id, bookings(status)')
        .eq('service_id', serviceId)
        .eq('wash_date', washDate)
        .eq('wash_time_slot', timeSlot)
        .neq('bookings.status', 'Cancelled');

      if (error) {
        console.error('[BookingService] Wash slot availability check error:', error);
        return false;
      }
      return (data || []).length < maxCapacity;
    } else {
      let count = 0;
      for (const b of memoryStore.bookings) {
        if (b.status === 'Cancelled') continue;
        if (b.wash_item && b.wash_item.wash_date === washDate && b.wash_item.wash_time_slot === timeSlot) {
          count++;
        }
      }
      return count < maxCapacity;
    }
  }

  /**
   * Create a new unified booking with strict backend validation & calculation
   */
  public static async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const taxRate = memoryStore.businessSettings.tax_rate || 8.5;
    let subtotal = 0;

    let rentalItemData: BookingRentalItem | undefined = undefined;
    let washItemData: BookingWashItem | undefined = undefined;

    // 1. Validate & Process Rental
    if (payload.booking_type === 'Rental' || payload.booking_type === 'Both') {
      if (!payload.rental || !payload.rental.car_id) {
        throw new Error('Rental details and selected vehicle are required');
      }

      // Check car availability
      const available = await this.isCarAvailable(
        payload.rental.car_id,
        payload.rental.pickup_date,
        payload.rental.return_date
      );

      if (!available) {
        throw new Error('Selected car is already booked for the specified date range.');
      }

      // Fetch car price from DB / Memory (never trust frontend prices)
      let car: Car | undefined = memoryStore.cars.find(c => c.id === payload.rental!.car_id);
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.from('cars').select('*').eq('id', payload.rental.car_id).single();
        if (data) car = data as Car;
      }

      if (!car) {
        throw new Error('Selected car does not exist in inventory');
      }

      const days = this.calculateRentalDays(payload.rental.pickup_date, payload.rental.return_date);
      const rentalTotal = days * car.price_per_day;
      subtotal += rentalTotal;

      rentalItemData = {
        car_id: car.id,
        car,
        pickup_date: payload.rental.pickup_date,
        pickup_time: payload.rental.pickup_time,
        return_date: payload.rental.return_date,
        return_time: payload.rental.return_time,
        rental_days: days,
        rental_price_per_day: car.price_per_day,
        item_total: rentalTotal,
      };
    }

    // 2. Validate & Process Car Wash
    if (payload.booking_type === 'Wash' || payload.booking_type === 'Both') {
      if (!payload.wash || !payload.wash.service_id) {
        throw new Error('Car wash service and time slot are required');
      }

      const slotAvailable = await this.isWashSlotAvailable(
        payload.wash.service_id,
        payload.wash.wash_date,
        payload.wash.wash_time_slot
      );

      if (!slotAvailable) {
        throw new Error('Selected car wash time slot is fully booked. Please choose another time slot.');
      }

      // Fetch service price
      let service: WashService | undefined = memoryStore.washServices.find(s => s.id === payload.wash!.service_id);
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.from('wash_services').select('*').eq('id', payload.wash.service_id).single();
        if (data) service = data as WashService;
      }

      if (!service) {
        throw new Error('Selected car wash service does not exist');
      }

      subtotal += service.price;

      washItemData = {
        service_id: service.id,
        service,
        vehicle_type: payload.wash.vehicle_type || 'Sedan',
        vehicle_registration: payload.wash.vehicle_registration || 'N/A',
        wash_date: payload.wash.wash_date,
        wash_time_slot: payload.wash.wash_time_slot,
        service_price: service.price,
        item_total: service.price,
      };
    }

    // Calculate Taxes & Discounts (5% bundle discount for 'Both')
    const discountAmount = payload.booking_type === 'Both' ? Number((subtotal * 0.05).toFixed(2)) : 0;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = Number(((taxableAmount * taxRate) / 100).toFixed(2));
    const totalAmount = Number((taxableAmount + taxAmount).toFixed(2));

    const newBooking: Booking = {
      id: uuidv4(),
      booking_number: this.generateBookingNumber(),
      booking_type: payload.booking_type,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      customer_email: payload.customer_email || '',
      customer_address: payload.customer_address || '',
      status: 'Confirmed',
      subtotal,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      additional_notes: payload.additional_notes || '',
      created_at: new Date().toISOString(),
      rental_item: rentalItemData,
      wash_item: washItemData,
    };

    // Save to Database or Memory Store
    if (isSupabaseConfigured && supabase) {
      const { error: bookingError } = await supabase.from('bookings').insert({
        id: newBooking.id,
        booking_number: newBooking.booking_number,
        booking_type: newBooking.booking_type,
        customer_name: newBooking.customer_name,
        customer_phone: newBooking.customer_phone,
        customer_email: newBooking.customer_email,
        customer_address: newBooking.customer_address,
        status: newBooking.status,
        subtotal: newBooking.subtotal,
        tax_amount: newBooking.tax_amount,
        discount_amount: newBooking.discount_amount,
        total_amount: newBooking.total_amount,
        additional_notes: newBooking.additional_notes,
      });

      if (bookingError) {
        console.error('[BookingService] Failed to insert booking:', bookingError);
        throw new Error('Database error saving booking');
      }

      if (rentalItemData) {
        await supabase.from('booking_items').insert({
          booking_id: newBooking.id,
          item_type: 'Rental',
          car_id: rentalItemData.car_id,
          pickup_date: rentalItemData.pickup_date,
          pickup_time: rentalItemData.pickup_time,
          return_date: rentalItemData.return_date,
          return_time: rentalItemData.return_time,
          rental_days: rentalItemData.rental_days,
          rental_price_per_day: rentalItemData.rental_price_per_day,
          item_total: rentalItemData.item_total,
        });
      }

      if (washItemData) {
        await supabase.from('booking_items').insert({
          booking_id: newBooking.id,
          item_type: 'Wash',
          service_id: washItemData.service_id,
          vehicle_type: washItemData.vehicle_type,
          vehicle_registration: washItemData.vehicle_registration,
          wash_date: washItemData.wash_date,
          wash_time_slot: washItemData.wash_time_slot,
          service_price: washItemData.service_price,
          item_total: washItemData.item_total,
        });
      }
    } else {
      memoryStore.bookings.unshift(newBooking);
    }

    // Trigger Notification Dispatcher
    NotificationService.sendBookingConfirmation(newBooking, memoryStore.businessSettings).catch(console.error);

    return newBooking;
  }
}
