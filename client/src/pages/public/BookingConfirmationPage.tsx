import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { downloadBookingReceiptPDFClient } from '../../utils/pdfGenerator';
import { Booking, BusinessSettings } from '../../types';
import {
  CheckCircle2,
  FileText,
  Download,
  Calendar,
  Phone,
  MessageSquare,
  Home,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const BookingConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trigger confetti burst
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F0FF', '#FFB800', '#FFFFFF', '#38BDF8']
    });

    if (id) {
      Promise.all([api.getBookingById(id), api.getBusinessSettings()])
        .then(([bData, sData]) => {
          setBooking(bData);
          setBusinessSettings(sData);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDownloadPDF = () => {
    if (booking && businessSettings) {
      downloadBookingReceiptPDFClient(booking, businessSettings);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="w-12 h-12 border-4 border-ag-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading booking confirmation...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="pt-32 pb-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Booking Not Found</h2>
        <Link to="/" className="px-6 py-3 rounded-xl bg-ag-cyan text-slate-950 font-bold">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* SUCCESS BANNER */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-6 border border-ag-cyan/40 cyan-glow">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-2xl">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs text-ag-cyan font-bold uppercase tracking-widest block">Booking Received</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-white">
            RESERVATION CONFIRMED!
          </h1>
          <p className="text-sm text-slate-300">
            Thank you <strong className="text-white">{booking.customer_name}</strong>. Your reservation details have been logged in our system.
          </p>
        </div>

        {/* BOOKING NUMBER BADGE */}
        <div className="inline-block p-4 rounded-2xl bg-ag-surface/80 border border-ag-border text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Official Booking ID</span>
          <span className="font-heading text-2xl font-black text-ag-gold tracking-wider block mt-1">
            {booking.booking_number}
          </span>
        </div>

        {/* NOTIFICATION MSG ALERT */}
        <div className="p-4 rounded-2xl bg-ag-cyan/10 border border-ag-cyan/30 text-xs text-ag-cyan flex items-center justify-center gap-2 max-w-xl mx-auto">
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span>A confirmation message with your Booking ID has been dispatched to <strong>{booking.customer_phone}</strong>.</span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-ag-cyan to-blue-500 text-slate-950 font-black text-sm cyan-glow hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download PDF Receipt
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-ag-surface hover:bg-ag-border border border-ag-border text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Return to Homepage
          </Link>
        </div>
      </div>

      {/* DETAILED SUMMARY BREAKDOWN */}
      <div className="glass-panel p-8 rounded-3xl space-y-6 border border-ag-border/80">
        <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-ag-cyan" />
          Reservation Summary Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div>
            <span className="text-slate-400 block mb-1">Customer Details</span>
            <p className="font-bold text-white">{booking.customer_name}</p>
            <p>{booking.customer_phone}</p>
            <p>{booking.customer_email}</p>
            <p>{booking.customer_address}</p>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Booking Overview</span>
            <p><strong className="text-white">Type:</strong> {booking.booking_type}</p>
            <p><strong className="text-white">Status:</strong> {booking.status}</p>
            <p><strong className="text-white">Created:</strong> {new Date(booking.created_at || Date.now()).toLocaleString()}</p>
          </div>
        </div>

        {/* LINE ITEMS */}
        {booking.rental_item && (
          <div className="p-4 rounded-2xl bg-ag-surface/50 border border-ag-border space-y-2">
            <span className="text-xs font-bold text-ag-cyan uppercase tracking-wider block">Vehicle Rental</span>
            <div className="flex justify-between text-xs text-white">
              <span>Pickup: {booking.rental_item.pickup_date} ({booking.rental_item.pickup_time})</span>
              <span>Return: {booking.rental_item.return_date} ({booking.rental_item.return_time})</span>
            </div>
            <p className="text-xs text-slate-300">Duration: {booking.rental_item.rental_days} Days @ ${booking.rental_item.rental_price_per_day}/day</p>
          </div>
        )}

        {booking.wash_item && (
          <div className="p-4 rounded-2xl bg-ag-surface/50 border border-ag-border space-y-2">
            <span className="text-xs font-bold text-ag-gold uppercase tracking-wider block">Car Wash Appointment</span>
            <div className="flex justify-between text-xs text-white">
              <span>Vehicle: {booking.wash_item.vehicle_type} ({booking.wash_item.vehicle_registration})</span>
              <span>Slot: {booking.wash_item.wash_date} at {booking.wash_item.wash_time_slot}</span>
            </div>
          </div>
        )}

        {/* TOTAL BREAKDOWN */}
        <div className="pt-4 border-t border-ag-border/80 flex justify-between items-baseline text-sm">
          <span className="font-bold text-slate-300">Total Paid / Due</span>
          <span className="font-heading text-3xl font-black text-white">${booking.total_amount.toFixed(2)}</span>
        </div>
      </div>

    </div>
  );
};
