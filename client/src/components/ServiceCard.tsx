import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { WashService } from '../types/index.js';

interface ServiceCardProps {
  service: WashService;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const imageUrl = service.image_url || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group border border-ag-border/70 hover:border-ag-cyan/40">
      
      {/* SERVICE IMAGE & CATEGORY BADGE */}
      <div>
        <div className="relative h-48 overflow-hidden bg-ag-surface">
          <img
            src={imageUrl}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ag-card via-transparent to-transparent opacity-85" />
          
          <div className="absolute top-4 left-4 bg-ag-cyan/20 border border-ag-cyan/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-ag-cyan uppercase tracking-wider">
            {service.category}
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-ag-gold font-medium bg-ag-dark/80 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-ag-border/60">
              <Clock className="w-3.5 h-3.5" />
              ~{service.duration_minutes} Mins
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-3">
          <h3 className="font-heading text-xl font-bold text-white group-hover:text-ag-cyan transition-colors">
            {service.name}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-6 pt-0 border-t border-ag-border/40 mt-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Service Price</span>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-2xl font-black text-white">${service.price}</span>
          </div>
        </div>

        <Link
          to={`/booking?type=wash&service_id=${service.id}`}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-ag-cyan to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
        >
          Book Service
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
