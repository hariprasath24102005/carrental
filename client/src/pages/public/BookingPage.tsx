import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Car, WashService, BookingType, CreateBookingPayload } from '../../types';
import {
  Car as CarIcon,
  Sparkles,
  Layers,
  User,
  AlertCircle,
  ArrowRight,
  Plus,
  Minus,
  Calendar as CalendarIcon
} from 'lucide-react';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Date helper math
  const todayStr = new Date().toISOString().split('T')[0];

  const calcReturnDate = (startStr: string, numDays: number) => {
    const d = new Date(startStr);
    d.setDate(d.getDate() + numDays);
    return d.toISOString().split('T')[0];
  };

  const calcDaysBetween = (startStr: string, endStr: string) => {
    const p = new Date(startStr).getTime();
    const r = new Date(endStr).getTime();
    const diff = Math.ceil((r - p) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

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
  const [rentalDays, setRentalDays] = useState(2);
  const [pickupDate, setPickupDate] = useState(todayStr);
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState(calcReturnDate(todayStr, 2));
  const [returnTime, setReturnTime] = useState('10:00');

  // Selected Wash Details
  const [selectedServiceId, setSelectedServiceId] = useState(searchParams.get('service_id') || '');
  const [vehicleType, setVehicleType] = useState('Sedan');
  const [vehicleReg, setVehicleReg] = useState('');
  const [washDate, setWashDate] = useState(todayStr);
  const [washTimeSlot, setWashTimeSlot] = useState('10:00');

  // Customer Form Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');

  const availableSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Event Handlers for Live Date & Days Sync
  const handlePickupDateChange = (newDate: string) => {
    setPickupDate(newDate);
    const newReturn = calcReturnDate(newDate, rentalDays);
    setReturnDate(newReturn);
  };

  const handleReturnDateChange = (newDate: string) => {
    setReturnDate(newDate);
    const newDays = calcDaysBetween(pickupDate, newDate);
    setRentalDays(newDays);
  };

  const handleDaysChange = (newDays: number) => {
    const validDays = Math.max(1, newDays);
    setRentalDays(validDays);
    const newReturn = calcReturnDate(pickupDate, validDays);
    setReturnDate(newReturn);
  };

  useEffect(() => {
    Promise.all([api.getCars(), api.getWashServices()])
      .then(([carsData, servicesData]) => {
        const availableCars = carsData.filter(c => c.status === 'Available');
        const activeServices = servicesData.filter(s => s.is_active !== false);

        setCars(availableCars.length > 0 ? availableCars : carsData);
        setWashServices(activeServices.length > 0 ? activeServices : servicesData);

        const paramCarId = searchParams.get('car_id');
        const paramServiceId = searchParams.get('service_id');

        if (paramCarId && carsData.some(c => String(c.id) === String(paramCarId))) {
          setSelectedCarId(paramCarId);
        } else if (carsData.length > 0 && !selectedCarId) {
          setSelectedCarId(carsData[0].id);
        }

        if (paramServiceId && servicesData.some(s => String(s.id) === String(paramServiceId))) {
          setSelectedServiceId(paramServiceId);
        } else if (servicesData.length > 0 && !selectedServiceId) {
          setSelectedServiceId(servicesData[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingData(false));
  }, [searchParams]);

  // Calculate Price Breakdown
  const selectedCar = cars.find(c => String(c.id) === String(selectedCarId));
  const selectedService = washServices.find(s => String(s.id) === String(selectedServiceId));

  let subtotal = 0;

  if (bookingType === 'Rental' || bookingType === 'Both') {
    if (selectedCar) subtotal += rentalDays * selectedCar.price_per_day;
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
          car_id: selectedCarId || (cars.length > 0 ? cars[0].id : ''),
          pickup_date: pickupDate,
          pickup_time: pickupTime,
          return_date: returnDate,
          return_time: returnTime,
        };
      }

      if (bookingType === 'Wash' || bookingType === 'Both') {
        payload.wash = {
          service_id: selectedServiceId || (washServices.length > 0 ? washServices[0].id : ''),
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
      <div className="pt-32 pb-20 text-center bg-slate-50 min-h-screen">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-medium">Loading booking options...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-slate-50 text-slate-800">
      
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs text-red-600 font-bold uppercase tracking-widest block">Instant Reservation Engine</span>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight">
          BOOK YOUR EXPERIENCE
        </h1>
        <p className="text-slate-600 text-sm font-normal">
          Select car rental, car washing, or combine both for an exclusive 5% bundle discount.
        </p>
      </div>

      {/* ERROR MESSAGE ALERT */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* BOOKING TYPE SELECTOR TABS */}
      <div className="grid grid-cols-3 gap-3 p-2 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <button
          type="button"
          onClick={() => setBookingType('Rental')}
          className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            bookingType === 'Rental'
              ? 'bg-slate-800 text-white shadow-md shadow-slate-800/15'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CarIcon className="w-4 h-4 text-red-400" />
          Car Rental
        </button>

        <button
          type="button"
          onClick={() => setBookingType('Wash')}
          className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            bookingType === 'Wash'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Car Wash
        </button>

        <button
          type="button"
          onClick={() => setBookingType('Both')}
          className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            bookingType === 'Both'
              ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
          <div className="bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 p-6 sm:p-8 rounded-3xl space-y-6">
            <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
              <CarIcon className="w-5 h-5 text-red-600" />
              1. Select Rental Vehicle & Duration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* VEHICLE PICKER */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Select Vehicle</label>
                <select
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-semibold focus:outline-none focus:border-red-500 focus:bg-white cursor-pointer shadow-sm"
                  required
                >
                  {cars.map((c) => (
                    <option key={c.id} value={c.id} className="bg-white text-slate-800 font-medium py-2">
                      {c.brand} {c.name} (${c.price_per_day}/day)
                    </option>
                  ))}
                </select>
              </div>

              {/* RENTAL DURATION CONTROL (STEPPER & QUICK PILLS) */}
              <div className="space-y-3 md:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-red-600" />
                    Select Rental Duration
                  </label>

                  {/* Stepper controls */}
                  <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <button
                      type="button"
                      onClick={() => handleDaysChange(rentalDays - 1)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-red-600 transition-colors"
                      aria-label="Decrease rental days"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="font-heading text-lg font-black text-red-600 min-w-[60px] text-center">
                      {rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDaysChange(rentalDays + 1)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-red-600 transition-colors"
                      aria-label="Increase rental days"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick preset duration pills */}
                <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
                  {[1, 2, 3, 5, 7, 10, 14].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDaysChange(d)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        rentalDays === d
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {d} {d === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>

              {/* PICKUP DATE & TIME */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Pickup Date & Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    min={todayStr}
                    value={pickupDate}
                    onChange={(e) => handlePickupDateChange(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                    required
                  />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* RETURN DATE & TIME */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Return Date & Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    min={pickupDate}
                    value={returnDate}
                    onChange={(e) => handleReturnDateChange(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                    required
                  />
                  <input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 1B. CAR WASH SELECTION */}
        {(bookingType === 'Wash' || bookingType === 'Both') && (
          <div className="bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 p-6 sm:p-8 rounded-3xl space-y-6">
            <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
              <Sparkles className="w-5 h-5 text-red-600" />
              {bookingType === 'Both' ? '2. Select Washing Package & Slot' : '1. Select Washing Package & Slot'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* SERVICE PICKER */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Select Washing / Detailing Package</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-semibold focus:outline-none focus:border-red-500 focus:bg-white cursor-pointer shadow-sm"
                  required
                >
                  {washServices.length === 0 ? (
                    <option value="" disabled className="bg-white text-slate-400">
                      No washing packages available
                    </option>
                  ) : (
                    washServices.map((s) => (
                      <option key={s.id} value={s.id} className="bg-white text-slate-800 font-medium py-2">
                        {s.name} — ${s.price} ({s.duration_minutes} Mins)
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* VEHICLE TYPE & REGISTRATION */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                >
                  <option value="Sedan" className="bg-white text-slate-800">Sedan / Coupe</option>
                  <option value="SUV" className="bg-white text-slate-800">SUV / Crossover</option>
                  <option value="Sports Car" className="bg-white text-slate-800">Exotic / Sports Car</option>
                  <option value="Truck / Van" className="bg-white text-slate-800">Truck / Van</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">License Plate / Registration</label>
                <input
                  type="text"
                  placeholder="e.g. NY-77-XYZ"
                  value={vehicleReg}
                  onChange={(e) => setVehicleReg(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              {/* WASH DATE */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Appointment Date</label>
                <input
                  type="date"
                  min={todayStr}
                  value={washDate}
                  onChange={(e) => setWashDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                  required
                />
              </div>

              {/* TIME SLOT PICKER */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Select Available Time Slot</label>
                <select
                  value={washTimeSlot}
                  onChange={(e) => setWashTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                  required
                >
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot} className="bg-white text-slate-800">
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
        <div className="bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
            <User className="w-5 h-5 text-red-600" />
            Customer Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Full Name *</label>
              <input
                type="text"
                placeholder="Alexander Wright"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Phone Number (SMS Notifications) *</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="alex.wright@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Delivery Address / Location (Optional)</label>
              <input
                type="text"
                placeholder="100 Park Ave, Suite 500, NY"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Special Notes or Requirements</label>
              <textarea
                rows={2}
                placeholder="Airport pickup, specific bug removal focus, etc..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
              />
            </div>

          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 3: SUMMARY & PRICE CALCULATION */}
        {/* ==================================================================== */}
        <div className="bg-slate-100/80 border border-slate-200/90 shadow-lg shadow-slate-200/40 p-6 sm:p-8 rounded-3xl space-y-4">
          <h3 className="font-heading text-xl font-bold text-slate-900 uppercase tracking-tight">Booking Price Summary</h3>

          <div className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-200 font-medium">
            {(bookingType === 'Rental' || bookingType === 'Both') && selectedCar && (
              <div className="flex justify-between py-1">
                <span>Rental: {selectedCar.brand} {selectedCar.name} ({rentalDays} {rentalDays === 1 ? 'Day' : 'Days'} x ${selectedCar.price_per_day})</span>
                <span className="font-bold text-slate-800">${(rentalDays * selectedCar.price_per_day).toFixed(2)}</span>
              </div>
            )}

            {(bookingType === 'Wash' || bookingType === 'Both') && selectedService && (
              <div className="flex justify-between py-1">
                <span>Wash Service: {selectedService.name}</span>
                <span className="font-bold text-slate-800">${selectedService.price.toFixed(2)}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between py-1 text-amber-600 font-bold">
                <span>Bundle Discount (5% Off)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between py-1">
              <span>Estimated Tax (8.5%)</span>
              <span className="font-bold text-slate-800">${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200 text-base font-bold text-slate-900">
              <span>Total Amount</span>
              <span className="font-heading text-2xl font-black text-red-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 mt-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-xl shadow-red-600/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
