import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { WashService, WashCategory } from '../../types';
import { Plus, Edit2, Trash2, X, Sparkles } from 'lucide-react';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<WashService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<WashService | null>(null);

  // Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(85);
  const [duration, setDuration] = useState(60);
  const [category, setCategory] = useState<WashCategory>('Premium Washing');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchServices = async () => {
    try {
      const data = await api.getWashServices();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice(85);
    setDuration(60);
    setCategory('Premium Washing');
    setImageUrl('');
    setIsActive(true);
    setEditingService(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (s: WashService) => {
    setEditingService(s);
    setName(s.name);
    setDescription(s.description);
    setPrice(s.price);
    setDuration(s.duration_minutes);
    setCategory(s.category);
    setImageUrl(s.image_url || '');
    setIsActive(s.is_active);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<WashService> = {
      name,
      description,
      price: Number(price),
      duration_minutes: Number(duration),
      category,
      image_url: imageUrl,
      is_active: isActive
    };

    try {
      if (editingService) {
        await api.updateWashService(editingService.id, payload);
      } else {
        await api.createWashService(payload);
      }
      setShowModal(false);
      resetForm();
      fetchServices();
    } catch (err: any) {
      alert(err.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this washing service?')) {
      try {
        await api.deleteWashService(id);
        fetchServices();
      } catch (err: any) {
        alert(err.message || 'Failed to delete service');
      }
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-ag-gold font-bold uppercase tracking-widest block">Detailing Catalog</span>
          <h1 className="font-heading text-3xl font-black text-white">CAR WASH SERVICES</h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-ag-gold to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md gold-glow hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Wash Package
        </button>
      </div>

      {/* SERVICES TABLE */}
      {loading ? (
        <div className="h-64 rounded-3xl bg-ag-surface/50 animate-pulse" />
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-ag-border/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-ag-surface/80 text-white font-bold uppercase text-[10px] tracking-wider border-b border-ag-border">
                <tr>
                  <th className="p-4">Service Package</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ag-border/50">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-ag-surface/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <img
                        src={s.image_url || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80'}
                        alt={s.name}
                        className="w-12 h-9 object-cover rounded-lg bg-ag-surface"
                      />
                      <span>{s.name}</span>
                    </td>
                    <td className="p-4 text-ag-gold font-semibold">{s.category}</td>
                    <td className="p-4">~{s.duration_minutes} Mins</td>
                    <td className="p-4 font-bold text-white">${s.price}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${s.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {s.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-2 rounded-lg bg-ag-surface hover:bg-ag-border text-slate-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-xl w-full p-8 rounded-3xl space-y-6 border border-ag-gold/40">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold text-white">
                {editingService ? 'Edit Wash Package' : 'Add New Wash Package'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Package Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anti Gravity Signature Wash"
                  required
                  className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WashCategory)}
                    className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                  >
                    <option value="Basic Washing">Basic Washing</option>
                    <option value="Premium Washing">Premium Washing</option>
                    <option value="Detailing">Detailing</option>
                    <option value="Ceramic & Polish">Ceramic & Polish</option>
                    <option value="Add-on Services">Add-on Services</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Price ($) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Est. Duration (Mins)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-ag-surface text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-ag-gold text-slate-950 font-bold"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
