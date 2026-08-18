import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Users, ShieldCheck, ArrowRight, Zap, Gauge } from 'lucide-react';
import { Car } from '../types/index.js';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const primaryImage = car.images && car.images.length > 0
    ? car.images.find(img => img.is_primary)?.image_url || car.images[0].image_url
    : 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80';

  const isAvailable = car.status === 'Available';

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group h-full border border-ag-border/70 hover:border-ag-cyan/40">
      
      {/* CAR IMAGE CONTAINER */}
      <div className="relative h-56 overflow-hidden bg-ag-surface">
        <img
          src={primaryImage}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ag-card via-transparent to-transparent opacity-80" />

        {/* STATUS BADGE */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${
              isAvailable
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : car.status === 'Maintenance'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
          >
            {car.status}
          </span>
        </div>

        {/* FUEL TYPE BADGE */}
        <div className="absolute top-4 right-4 bg-ag-dark/80 backdrop-blur-md border border-ag-border/80 px-2.5 py-1 rounded-lg text-xs text-slate-300 font-medium flex items-center gap-1.5">
          <Fuel className="w-3.5 h-3.5 text-ag-cyan" />
          {car.fuel_type}
        </div>

        {/* BRAND TITLE OVERLAY */}
        <div className="absolute bottom-3 left-4 right-4">
          <span className="text-xs text-ag-cyan font-semibold uppercase tracking-wider block">
            {car.brand}
          </span>
          <h3 className="font-heading text-xl font-bold text-white group-hover:text-ag-cyan transition-colors truncate">
            {car.name}
          </h3>
        </div>
      </div>

      {/* BODY SPECIFICATIONS */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-200 text-xs text-slate-700">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 border border-slate-200/80">
            <Gauge className="w-4 h-4 text-ag-cyan mb-1" />
            <span className="font-bold text-slate-900">{car.transmission}</span>
            <span className="text-[10px] text-slate-600 font-medium">Gearbox</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 border border-slate-200/80">
            <Users className="w-4 h-4 text-ag-cyan mb-1" />
            <span className="font-bold text-slate-900">{car.seating_capacity} Seats</span>
            <span className="text-[10px] text-slate-600 font-medium">Capacity</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 border border-slate-200/80">
            <Zap className="w-4 h-4 text-ag-gold mb-1" />
            <span className="font-bold text-slate-900">{car.year}</span>
            <span className="text-[10px] text-slate-600 font-medium">Model Year</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
          {car.description}
        </p>

        {/* PRICE & FOOTER ACTION */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-200">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">Rental Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-2xl font-black text-slate-900">${car.price_per_day}</span>
              <span className="text-xs text-slate-600 font-medium">/ day</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/cars/${car.id}`}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              Details
            </Link>
            {isAvailable && (
              <Link
                to={`/booking?type=rental&car_id=${car.id}`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-ag-cyan to-red-600 text-white font-bold text-xs flex items-center gap-1 shadow-md hover:scale-105 transition-transform"
              >
                Book
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
