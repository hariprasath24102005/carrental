import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs text-ag-cyan font-bold uppercase tracking-widest block">Concierge & Support</span>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-slate-900">
          CONTACT ANTI GRAVITY
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-medium">
          Have questions about fleet availability, custom detailing quotes, or long-term rentals? Reach out to our team 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* CONTACT INFO & DIRECT WHATSAPP */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-200 shadow-md">
            <h3 className="font-heading text-xl font-bold text-slate-900">Contact Details</h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-ag-cyan shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Headquarters & Detail Center</strong>
                  <span className="text-slate-600">100 Anti Gravity Way, Suite 500, New York, NY 10001</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-ag-cyan shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Direct Phone Line</strong>
                  <span className="text-slate-600">+91 9363115217</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-ag-cyan shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Support Email</strong>
                  <span className="text-slate-600">contact@antigravitycars.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-ag-gold shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Operating Hours</strong>
                  <span className="text-slate-600">Monday - Sunday: 8:00 AM - 8:00 PM</span>
                </div>
              </div>
            </div>

            {/* DIRECT WHATSAPP BUTTON */}
            <a
              href="https://wa.me/919363115217?text=Hello%20Anti%20Gravity,%20I%20have%20an%20inquiry%20regarding..."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Chat Directly on WhatsApp
            </a>
          </div>

          {/* MAP MOCKUP */}
          <div className="glass-panel p-4 rounded-3xl overflow-hidden border border-slate-200 shadow-md">
            <div className="relative h-48 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
                alt="Location Map Mockup"
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute p-3 rounded-xl bg-white/95 backdrop-blur-md border border-ag-cyan/40 text-center shadow-lg">
                <MapPin className="w-6 h-6 text-ag-cyan mx-auto mb-1 animate-bounce" />
                <span className="text-xs font-bold text-slate-900 block">Anti Gravity HQ</span>
                <span className="text-[10px] text-slate-600 font-medium">100 Anti Gravity Way, NY</span>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGE FORM */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6 border border-slate-200 shadow-md">
            <h3 className="font-heading text-xl font-bold text-slate-900">Send Us a Message</h3>

            {submitted ? (
              <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-xl font-bold text-slate-900">Message Sent Successfully!</h4>
                <p className="text-xs text-slate-600 font-medium">
                  Thank you. Our concierge team will get back to you within 30 minutes.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-ag-cyan text-white font-bold text-xs hover:bg-red-600 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Your Name *</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-ag-cyan focus:ring-1 focus:ring-ag-cyan"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-ag-cyan focus:ring-1 focus:ring-ag-cyan"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-ag-cyan focus:ring-1 focus:ring-ag-cyan"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Your Message *</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your inquiry or special booking request..."
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-ag-cyan focus:ring-1 focus:ring-ag-cyan"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-ag-cyan to-red-600 text-white font-black text-sm cyan-glow hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Message
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
