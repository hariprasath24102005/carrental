import React from 'react';
import { ShieldCheck, Award, Users, Car, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs text-ag-cyan font-bold uppercase tracking-widest block">Automotive Excellence</span>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-white">
          ABOUT ANTI GRAVITY
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Built on a passion for high-performance engineering, pristine aesthetics, and flawless customer service.
        </p>
      </div>

      {/* STORY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-heading text-3xl font-bold text-white">
            REDEFINING CAR RENTAL & VEHICLE DETAILING
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Anti Gravity was founded with a single mission: to eliminate the friction, hidden fees, and compromised quality traditional automotive rental and car wash businesses inflict on customers.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Whether you are renting a Porsche 911 Carrera S for a scenic weekend trip or entrusting your daily driver for a multi-stage ceramic paint correction, our team applies relentless standards of perfection.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-ag-surface/50 border border-ag-border/50">
              <span className="font-heading text-3xl font-black text-ag-cyan block">500+</span>
              <span className="text-xs text-slate-400">Happy Clients</span>
            </div>
            <div className="p-4 rounded-2xl bg-ag-surface/50 border border-ag-border/50">
              <span className="font-heading text-3xl font-black text-ag-gold block">100%</span>
              <span className="text-xs text-slate-400">Spotless Guarantee</span>
            </div>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden h-96 border border-ag-border/80 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
            alt="Anti Gravity Showroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ag-dark via-transparent to-transparent" />
        </div>
      </div>

      {/* VALUES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-ag-cyan/10 text-ag-cyan flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-white">Curated Fleet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We only acquire top-tier models with full option packages, ensuring your rental feels truly special.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-ag-gold/10 text-ag-gold flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-white">Master Detailing</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Certified technicians utilizing pH-balanced products, dual-action polishers, and 9H ceramic sealants.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-white">Total Transparency</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No surprise add-on fees or hidden terms. Clear pricing, instant receipts, and instant communication.
          </p>
        </div>
      </div>

    </div>
  );
};
