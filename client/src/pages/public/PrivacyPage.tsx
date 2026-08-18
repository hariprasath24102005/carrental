import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 text-sm leading-relaxed">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
          PRIVACY POLICY
        </h1>
        <p className="text-xs text-slate-500 font-medium">Last updated: August 2026</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-200 shadow-md">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
          <p className="text-slate-700">
            When reserving a vehicle or car wash service at Anti Gravity, we collect your name, phone number, email address, physical delivery address, and vehicle registration details required to complete your booking.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. SMS & WhatsApp Notifications</h2>
          <p className="text-slate-700">
            Your phone number is strictly used to send transaction updates, booking confirmations, and arrival notifications. We never sell your personal contact details to third-party telemarketers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Data Security & Storage</h2>
          <p className="text-slate-700">
            All payment transactions and user credentials are encrypted using industry-standard SSL encryption and stored securely in our cloud database infrastructure.
          </p>
        </section>
      </div>
    </div>
  );
};
