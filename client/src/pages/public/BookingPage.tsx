import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Car, WashService, BookingType, CreateBookingPayload } from '../../types';
import {
  Car as CarIcon,
  Sparkles,
  Layers,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Booking Type State
  const queryType = (searchParams.get('type') || '').toLowerCase();
  const [bookingType, setBookingType] = useState<BookingType>(
    queryType === 'wash' ? 'Wash' : queryType === 'both' ? 'Both' : 'Rental'
  );

  // Loaded Options
  const [cars, setCars] = useState<Car[]>([]);
  const [washServices, setWashServices] = useState<WashService[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Selected Rental Details
  const [selectedCarId, setSelectedCarId] = useState(searchParams.get('car_id') || '');
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [returnTime, setReturnTime] = useState('10:00');

  // Selected Wash Details
  const [selectedServiceId, setSelectedServiceId] = useState(searchParams.get('service_id') || '');
  const [vehicleType, setVehicleType] = useState('Sedan');
  const [vehicleReg, setVehicleReg] = useState('');
  const [washDate, setWashDate] = useState(new Date().toISOString().split('T')[0]);
  const [washTimeSlot, setWashTimeSlot] = useState('10:00');

  // Customer Form Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [step, setStep] = useState(1);

  const availableSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  useEffect(() => {
    Promise.all([api.getCars(), api.getWashServices()])
      .then(([carsData, servicesData]) => {
        setCars(carsData.filter(c => c.status === 'Available'));
        setWashServices(servicesData.filter(s => s.is_active));

        if (!selectedCarId && carsData.length > 0) {
          setSelectedCarId(carsData[0].id);
        }
        if (!selectedServiceId && servicesData.length > 0) {
          setSelectedServiceId(servicesData[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingData(false));
  }, []);

  // Calculate Price Breakdown
  const selectedCar = cars.find(c => c.id === selectedCarId);
  const selectedService = washServices.find(s => s.id === selectedServiceId);

  const getRentalDays = () => {
    const p = new Date(pickupDate).getTime();
    const r = new Date(returnDate).getTime();
    const diff = Math.ceil((r - p) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const days = getRentalDays();
  let subtotal = 0;

  if (bookingType === 'Rental' || bookingType === 'Both') {
    if (selectedCar) subtotal += days * selectedCar.price_per_day;
  }
  if (bookingType === 'Wash' || bookingType === 'Both') {
    if (selectedService) subtotal += selectedService.price;
  }

  const discount = bookingType === 'Both' ? subtotal * 0.05 : 0;
  const taxable = subtotal - discount;
  const tax = taxable * 0.085;
  const total = taxable + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName || !customerPhone) {
      setErrorMessage('Please fill in your full name and phone number.');
      return;
    }

    setSubmitting(true);

    try {
      const payload: CreateBookingPayload = {
        booking_type: bookingType,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        customer_address: customerAddress,
        additional_notes: notes,
      };

      if (bookingType === 'Rental' || bookingType === 'Both') {
        payload.rental = {
          car_id: selectedCarId,
          pickup_date: pickupDate,
          pickup_time: pickupTime,
          return_date: returnDate,
          return_time: returnTime,
        };
      }

      if (bookingType === 'Wash' || bookingType === 'Both') {
        payload.wash = {
          service_id: selectedServiceId,
          vehicle_type: vehicleType,
          vehicle_registration: vehicleReg,
          wash_date: washDate,
          wash_time_slot: washTimeSlot,
        };
      }

      const newBooking = await api.createBooking(payload);
      navigate(`/booking/confirmation/${newBooking.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="w-12 h-12 border-4 border-ag-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading booking options...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs text-ag-cyan font-bold uppercase tracking-widest block">Instant Reservation Engine</span>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-white">
          BOOK YOUR EXPERIENCE
        </h1>
        <p className="text-slate-400 text-sm">
          Select car rental, car washing, or combine both for an exclusive 5% bundle discount.
        </p>
      </div>

      {/* ERROR MESSAGE ALERT */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* BOOKING TYPE SELECTOR TABS */}
      <div className="grid grid-cols-3 gap-3 p-1.5 rounded-2xl bg-ag-surface/80 border border-ag-border/80">
        <button
          onClick={() => setBookingType('Rental')}
          className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            bookingType === 'Rental'
              ? 'bg-ag-cyan text-slate-950 shadow-md cyan-glow'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <CarIcon className="w-4 h-4" />
          Car Rental
        </button>

        <button
          onClick={() => setBookingType('Wash')}
          className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            bookingType === 'Wash'
              ? 'bg-ag-gold text-slate-950 shadow-md gold-glow'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Car Wash
        </button>

        <button
          onClick={() => setBookingType('Both')}
          className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            bookingType === 'Both'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          Rental & Wash Bundle (5% Off)
        </button>
      </div>

      {/* MAIN FORM */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ==================================================================== */}
        {/* SECTION 1: SELECTION & SCHEDULE */}
        {/* ==================================================================== */}
        
        {/* 1A. RENTAL SELECTION */}
        {(bookingType === 'Rental' || bookingType === 'Both') && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-ag-border/80">
            <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <CarIcon className="w-5 h-5 text-ag-cyan" />
              1. Select Rental Vehicle & Dates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* VEHICLE PICKER */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Select Vehicle</label>
                <select
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="w-full bg-ag-surface border border-ag-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ag-cyan"
                  required
                >
                  {cars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.brand} {c.name} (${c.price_per_day}/day)
                    </option>
                  ))}
                </select>
              </div>

              {/* RENTAL DAYS BADGE */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-ag-surface/50 border border-ag-border">
                <span className="text-xs text-slate-400">Total Rental Duration</span>
                <span className="font-heading text-xl font-bold text-ag-cyan">{days} Days</span>
              </div>

              {/* PICKUP DATE & TIME */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Pickup Date & Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="bg-ag-surface border border-ag-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-ag-cyan"
                    required
                  />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="bg-ag-surface border border-ag-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-ag-cyan"
                    required
                  />
                </div>
              </div>

              {/* RETURN DATE & TIME */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Return Date & Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="bg-ag-surface border border-ag-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-ag-cyan"
                    required
                  />
                  <input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="bg-ag-surface border border-ag-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-ag-cyan"
                    required
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 1B. CAR WASH SELECTION */}
        {(bookingType === 'Wash' || bookingType === 'Both') && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-ag-gold/30">
            <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-ag-gold" />
              {bookingType === 'Both' ? '2. Select Washing Package & Slot' : '1. Select Washing Package & Slot'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* SERVICE PICKER */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Select Washing / Detailing Package</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-ag-surface border border-ag-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ag-gold"
                  required
                >
                  {washServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (${s.price} - {s.duration_minutes} Mins)
                    </option>
                  ))}
                </select>
              </div>

              {/* VEHICLE TYPE & REGISTRATION */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full bg-ag-surface border border-ag-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-ag-gold"
                >
                  <option value="Sedan">Sedan / Coupe</option>
                  <option value="SUV">SUV / Crossover</option>
                  <option value="Sports Car">Exotic / Sports Car</option>
                  <option value="Truck / Van">Truck / Van</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">License Plate / Registration</label>
                <input
                  type="text"
                  placeholder="e.g. NY-77-XYZ"
                  value={vehicleReg}
                  onChange={(e) => setVehicleReg(e.target.value)}
                  className="w-full bg-ag-surface border border-ag-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-ag-gold"
                />
              </div>

              {/* WASH DATE */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Appointment Date</label>
                <input
                  type="date"
                  value={washDate}
                  onChange={(e) => setWashDate(e.target.value)}
                  className="w-full bg-ag-surface border border-ag-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-ag-gold"
                  required
                />
              </div>

              {/* TIME SLOT PICKER */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Select Available Time Slot</label>
                <select
                  value={washTimeSlot}
                  onChange={(e) => setWashTimeSlot(e.target.value)}
                  className="w-full bg-ag-surface border border-ag-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-ag-gold"
                  required
                >
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot} AM/PM Slot
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 2: CUSTOMER INFORMATION */}
        {/* ==================================================================== */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-ag-border/80">
          <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-ag-cyan" />
            Customer Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Full Name *</label>
              <input
                type="text"
                placeholder="Alexander Wright"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-ag-surface border border-ag-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ag-cyan"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Phone Number (SMS Notifications) *</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-ag-surface border border-ag-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ag-cyan"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="alex.wright@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-ag-surface border border-ag-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ag-cyan"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Delivery Address / Location (Optional)</label>
              <input
                type="text"
                placeholder="100 Park Ave, Suite 500, NY"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full bg-ag-surface border border-ag-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ag-cyan"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Special Notes or Requirements</label>
              <textarea
                rows={2}
                placeholder="Airport pickup, specific bug removal focus, etc..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-ag-surface border border-ag-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ag-cyan"
              />
            </div>

          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 3: SUMMARY & PRICE CALCULATION */}
        {/* ==================================================================== */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-ag-cyan/30 cyan-glow">
          <h3 className="font-heading text-xl font-bold text-white">Booking Price Summary</h3>

          <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-ag-border/60">
            {(bookingType === 'Rental' || bookingType === 'Both') && selectedCar && (
              <div className="flex justify-between py-1">
                <span>Rental: {selectedCar.brand} {selectedCar.name} ({days} Days x ${selectedCar.price_per_day})</span>
                <span className="font-bold text-white">${(days * selectedCar.price_per_day).toFixed(2)}</span>
              </div>
            )}

            {(bookingType === 'Wash' || bookingType === 'Both') && selectedService && (
              <div className="flex justify-between py-1">
                <span>Wash Service: {selectedService.name}</span>
                <span className="font-bold text-white">${selectedService.price.toFixed(2)}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between py-1 text-ag-gold font-semibold">
                <span>Bundle Discount (5% Off)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between py-1">
              <span>Estimated Tax (8.5%)</span>
              <span className="font-bold text-white">${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pt-3 border-t border-ag-border text-base font-black text-white">
              <span>Total Amount</span>
              <span className="font-heading text-2xl text-ag-cyan">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-ag-cyan to-blue-500 text-slate-950 font-black text-base cyan-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Confirm & Create Booking
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
