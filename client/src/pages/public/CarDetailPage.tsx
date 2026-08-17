import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CarCarousel } from '../../components/CarCarousel';
import { api } from '../../services/api';
import { Car } from '../../types';
import {
  Car as CarIcon,
  Fuel,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Gauge,
  Zap,
  DollarSign,
  ChevronLeft
} from 'lucide-react';

export const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getCarById(id)
        .then(setCar)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center">
        <div className="w-12 h-12 border-4 border-ag-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading car specifications...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Car Not Found</h2>
        <p className="text-slate-400">The requested vehicle is not available in our inventory.</p>
        <Link to="/cars" className="inline-block px-6 py-3 rounded-xl bg-ag-cyan text-slate-950 font-bold">
          Back to Fleet
        </Link>
      </div>
    );
  }

  const isAvailable = car.status === 'Available';

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* BREADCRUMB BACK BUTTON */}
      <Link to="/cars" className="inline-flex items-center gap-2 text-slate-400 hover:text-ag-cyan text-xs font-semibold">
        <ChevronLeft className="w-4 h-4" />
        Back to Rental Fleet
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: CAROUSEL & SPECIFICATIONS */}
        <div className="lg:col-span-7 space-y-8">
          <CarCarousel images={car.images || []} carName={car.name} />

          {/* DESCRIPTION */}
          <div className="glass-panel p-8 rounded-3xl space-y-4">
            <h3 className="font-heading text-xl font-bold text-white">Vehicle Description</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{car.description}</p>
          </div>

          {/* FEATURES CHECKLIST */}
          <div className="glass-panel p-8 rounded-3xl space-y-4">
            <h3 className="font-heading text-xl font-bold text-white">Premium Features & Equipment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {car.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-ag-cyan shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING BOX & SPECS MATRIX */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-8 rounded-3xl space-y-6 border border-ag-cyan/30 cyan-glow sticky top-28">
            
            <div>
              <span className="text-xs text-ag-cyan font-semibold uppercase tracking-wider block">
                {car.brand}
              </span>
              <h1 className="font-heading text-3xl font-black text-white mt-1">
                {car.name}
              </h1>
              <p className="text-xs text-slate-400 mt-1">Registration: {car.registration_number}</p>
            </div>

            {/* STATUS BADGE */}
            <div className="flex items-center justify-between py-3 border-y border-ag-border/60">
              <span className="text-xs text-slate-400">Current Availability</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isAvailable
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {car.status}
              </span>
            </div>

            {/* TECHNICAL MATRIX */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-ag-surface/60 border border-ag-border/50">
                <span className="text-slate-400 block text-[10px]">Powertrain</span>
                <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Fuel className="w-4 h-4 text-ag-cyan" />
                  {car.fuel_type}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-ag-surface/60 border border-ag-border/50">
                <span className="text-slate-400 block text-[10px]">Transmission</span>
                <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Gauge className="w-4 h-4 text-ag-cyan" />
                  {car.transmission}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-ag-surface/60 border border-ag-border/50">
                <span className="text-slate-400 block text-[10px]">Seating Capacity</span>
                <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Users className="w-4 h-4 text-ag-cyan" />
                  {car.seating_capacity} Persons
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-ag-surface/60 border border-ag-border/50">
                <span className="text-slate-400 block text-[10px]">Model Year</span>
                <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Zap className="w-4 h-4 text-ag-gold" />
                  {car.year}
                </span>
              </div>
            </div>

            {/* PRICING */}
            <div className="p-4 rounded-2xl bg-ag-surface/80 border border-ag-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Daily Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-3xl font-black text-white">${car.price_per_day}</span>
                  <span className="text-xs text-slate-400">/ day</span>
                </div>
              </div>
              {car.price_per_hour && (
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hourly Flex</span>
                  <span className="font-heading text-lg font-bold text-ag-gold">${car.price_per_hour}/hr</span>
                </div>
              )}
            </div>

            {/* BOOK NOW CTA */}
            {isAvailable ? (
              <Link
                to={`/booking?type=rental&car_id=${car.id}`}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-ag-cyan to-blue-500 text-slate-950 font-black text-base flex items-center justify-center gap-2 cyan-glow hover:scale-[1.02] transition-transform"
              >
                <Calendar className="w-5 h-5" />
                Book This Vehicle
              </Link>
            ) : (
              <button
                disabled
                className="w-full py-4 rounded-2xl bg-ag-surface text-slate-500 font-bold text-sm cursor-not-allowed border border-ag-border"
              >
                Currently Unavailable for Booking
              </button>
            )}

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-ag-cyan" />
              Includes full insurance & 24/7 roadside assistance
            </p>

          </div>
        </div>

      </div>

    </div>
  );
};
