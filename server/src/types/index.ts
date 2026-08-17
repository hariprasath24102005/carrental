// TypeScript Data Interfaces for Anti Gravity Application

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
export type TransmissionType = 'Automatic' | 'Manual';
export type CarStatus = 'Available' | 'Booked' | 'Maintenance' | 'Temporarily Unavailable';
export type WashCategory = 'Basic Washing' | 'Premium Washing' | 'Detailing' | 'Ceramic & Polish' | 'Add-on Services';
export type BookingType = 'Rental' | 'Wash' | 'Both';
export type BookingStatus = 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  registration_number: string;
  fuel_type: FuelType;
  transmission: TransmissionType;
  seating_capacity: number;
  price_per_day: number;
  price_per_hour?: number;
  description: string;
  features: string[];
  status: CarStatus;
  maintenance_notes?: string;
  created_at?: string;
  updated_at?: string;
  images?: CarImage[];
}

export interface CarImage {
  id?: string;
  car_id: string;
  image_url: string;
  is_primary: boolean;
  display_order?: number;
}

export interface WashService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_url?: string;
  category: WashCategory;
  is_active: boolean;
  created_at?: string;
}

export interface BookingRentalItem {
  car_id: string;
  car?: Car;
  pickup_date: string;
  pickup_time: string;
  return_date: string;
  return_time: string;
  rental_days: number;
  rental_price_per_day: number;
  item_total: number;
}

export interface BookingWashItem {
  service_id: string;
  service?: WashService;
  vehicle_type: string;
  vehicle_registration: string;
  wash_date: string;
  wash_time_slot: string;
  service_price: number;
  item_total: number;
}

export interface Booking {
  id: string;
  booking_number: string;
  booking_type: BookingType;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  status: BookingStatus;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  additional_notes?: string;
  created_at?: string;
  updated_at?: string;
  rental_item?: BookingRentalItem;
  wash_item?: BookingWashItem;
}

export interface TimeSlot {
  id?: string;
  slot_date: string;
  slot_time: string;
  max_capacity: number;
  booked_count: number;
  is_blocked: boolean;
  notes?: string;
}

export interface BusinessSettings {
  id?: string;
  business_name: string;
  tagline: string;
  phone_number: string;
  whatsapp_number: string;
  email: string;
  address: string;
  currency: string;
  tax_rate: number;
  opening_time: string;
  closing_time: string;
  slot_duration_minutes: number;
  max_wash_bookings_per_slot: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBookingPayload {
  booking_type: BookingType;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  additional_notes?: string;
  
  rental?: {
    car_id: string;
    pickup_date: string;
    pickup_time: string;
    return_date: string;
    return_time: string;
  };

  wash?: {
    service_id: string;
    vehicle_type: string;
    vehicle_registration: string;
    wash_date: string;
    wash_time_slot: string;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}
