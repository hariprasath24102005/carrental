import React, { useEffect, useState } from 'react';
import { ServiceCard } from '../../components/ServiceCard';
import { api } from '../../services/api';
import { WashService } from '../../types';
import { Sparkles, Clock, ShieldCheck, CheckCircle2, Droplets, Flame } from 'lucide-react';

export const WashingServicesPage: React.FC = () => {
  const [services, setServices] = useState<WashService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = [
    'All Categories',
    'Basic Washing',
    'Premium Washing',
    'Detailing',
    'Ceramic & Polish',
    'Add-on Services'
  ];

  useEffect(() => {
    setLoading(true);
    api.getWashServices(selectedCategory === 'All Categories' ? '' : selectedCategory)
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* PAGE HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs text-ag-gold font-bold uppercase tracking-widest block">Spotless Shine & Protection</span>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-white">
          CAR WASH & DETAILING SERVICES
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          From fast eco-friendly snow foam washes to professional multi-stage paint correction and 9H nano ceramic coating.
        </p>
      </div>

      {/* CATEGORY FILTER STRIP */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-center">
        {categories.map((cat) => {
          const isSel = (cat === 'All Categories' && !selectedCategory) || selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'All Categories' ? '' : cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isSel
                  ? 'bg-ag-gold text-slate-950 shadow-md gold-glow'
                  : 'bg-ag-card/80 text-slate-300 border border-ag-border/60 hover:bg-ag-surface'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* SERVICE GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-ag-surface/50 animate-pulse" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl">
          <p className="text-lg font-bold text-white">No wash services found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {/* DETAILING PROCESS BANNER */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl space-y-8 border border-ag-gold/30">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs text-ag-gold font-bold uppercase tracking-wider block">The Anti Gravity Standard</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            OUR 5-STEP SIGNATURE WASHING PROCESS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-ag-surface/60 border border-ag-border/50 text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-ag-gold/20 text-ag-gold font-black text-xs flex items-center justify-center mx-auto">1</span>
            <h4 className="font-bold text-white text-xs">High-Pressure Pre-Rinse</h4>
            <p className="text-[11px] text-slate-400">Blasts away abrasive surface grit</p>
          </div>
          <div className="p-4 rounded-2xl bg-ag-surface/60 border border-ag-border/50 text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-ag-gold/20 text-ag-gold font-black text-xs flex items-center justify-center mx-auto">2</span>
            <h4 className="font-bold text-white text-xs">Snow Foam Cannon</h4>
            <p className="text-[11px] text-slate-400">pH-balanced thick lubricated foam</p>
          </div>
          <div className="p-4 rounded-2xl bg-ag-surface/60 border border-ag-border/50 text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-ag-gold/20 text-ag-gold font-black text-xs flex items-center justify-center mx-auto">3</span>
            <h4 className="font-bold text-white text-xs">Two-Bucket Hand Mitt</h4>
            <p className="text-[11px] text-slate-400">Scratch-free paint agitation</p>
          </div>
          <div className="p-4 rounded-2xl bg-ag-surface/60 border border-ag-border/50 text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-ag-gold/20 text-ag-gold font-black text-xs flex items-center justify-center mx-auto">4</span>
            <h4 className="font-bold text-white text-xs">Purified De-Ionized Dry</h4>
            <p className="text-[11px] text-slate-400">Spot-free warm air blower drying</p>
          </div>
          <div className="p-4 rounded-2xl bg-ag-surface/60 border border-ag-border/50 text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-ag-gold/20 text-ag-gold font-black text-xs flex items-center justify-center mx-auto">5</span>
            <h4 className="font-bold text-white text-xs">Hydrophobic Sealant</h4>
            <p className="text-[11px] text-slate-400">Ultra-glossy UV protective shield</p>
          </div>
        </div>
      </div>

    </div>
  );
};
