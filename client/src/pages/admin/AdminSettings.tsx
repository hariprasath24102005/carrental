import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { BusinessSettings } from '../../types';
import { Save, CheckCircle2, Settings } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    api.getBusinessSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const updated = await api.updateBusinessSettings(settings);
      setSettings(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="w-12 h-12 border-4 border-ag-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading business settings...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      {/* HEADER */}
      <div>
        <span className="text-xs text-ag-cyan font-bold uppercase tracking-widest block">System Configuration</span>
        <h1 className="font-heading text-3xl font-black text-white">BUSINESS SETTINGS</h1>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Business settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl space-y-6 border border-ag-border/80 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Business Name *</label>
            <input
              type="text"
              value={settings.business_name}
              onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
              required
              className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Support Phone *</label>
            <input
              type="text"
              value={settings.phone_number}
              onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
              required
              className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">WhatsApp Business Phone</label>
            <input
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Contact Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={settings.tax_rate}
              onChange={(e) => setSettings({ ...settings, tax_rate: Number(e.target.value) })}
              className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-300 font-semibold block">Physical Detail Center Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Opening Time</label>
            <input
              type="time"
              value={settings.opening_time}
              onChange={(e) => setSettings({ ...settings, opening_time: e.target.value })}
              className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Closing Time</label>
            <input
              type="time"
              value={settings.closing_time}
              onChange={(e) => setSettings({ ...settings, closing_time: e.target.value })}
              className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Max Wash Capacity per Time Slot</label>
            <input
              type="number"
              value={settings.max_wash_bookings_per_slot}
              onChange={(e) => setSettings({ ...settings, max_wash_bookings_per_slot: Number(e.target.value) })}
              className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
            />
          </div>

        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-ag-cyan to-blue-500 text-slate-950 font-black text-sm cyan-glow hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Business Settings
        </button>
      </form>

    </div>
  );
};
