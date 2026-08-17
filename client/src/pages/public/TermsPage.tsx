import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-300 text-sm leading-relaxed">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
          TERMS & CONDITIONS
        </h1>
        <p className="text-xs text-slate-400">Last updated: August 2026</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl space-y-6 border border-ag-border">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Driver Eligibility & Licensing</h2>
          <p>
            All rental drivers must be at least 21 years of age and hold a valid, unexpired driver's license issued in their home state or country. High-performance exotic vehicles (e.g. Porsche 911, AMG G 63) require a minimum driver age of 25.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Insurance & Security Deposit</h2>
          <p>
            Comprehensive full-coverage insurance or verified primary personal auto insurance is required for all car rentals. A security deposit authorization is placed on the customer's credit card prior to vehicle pickup.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Car Washing & Detailing Warranties</h2>
          <p>
            Our 9H Nano Ceramic Coating services include a 3-Year Limited Paint Protection Warranty covering fading, oxidation, and bird-dropping etching when maintained per provided care instructions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Cancellations & Refunds</h2>
          <p>
            Rental bookings cancelled at least 48 hours prior to pickup time receive a 100% full refund. Car wash appointments can be rescheduled or cancelled up to 4 hours in advance with zero penalty.
          </p>
        </section>
      </div>
    </div>
  );
};
