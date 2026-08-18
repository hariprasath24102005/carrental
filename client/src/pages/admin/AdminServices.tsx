import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { WashService, WashCategory } from '../../types';
import { Plus, Edit2, Trash2, X, Sparkles, Clock, DollarSign } from 'lucide-react';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<WashService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<WashService | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(99);
  const [duration, setDuration] = useState(45);
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<WashCategory>('Premium Washing');
  const [isActive, setIsActive] = useState(true);

  const fetchServices = async () => {
    try {
      const data = await api.getWashServices();
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch wash services:', err);
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
    setPrice(99);
    setDuration(45);
    setImageUrl('');
    setCategory('Premium Washing');
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
    setImageUrl(s.image_url || '');
    setCategory(s.category);
    setIsActive(s.is_active !== false);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<WashService> = {
      name,
      description,
      price: Number(price),
      duration_minutes: Number(duration),
      image_url: imageUrl || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
      category,
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
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.deleteWashService(id);
        fetchServices();
      } catch (err: any) {
        alert(err.message || 'Failed to delete service');
      }
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-slate-50 text-slate-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-red-600 font-bold uppercase tracking-widest block">Detailing Catalog</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">CAR WASH SERVICES</h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-red-600/20 hover:scale-105 transition-all uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          Add New Wash Service
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="h-64 rounded-3xl bg-slate-200/60 animate-pulse" />
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-100 text-slate-900 font-black uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Service</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={s.image_url || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80'}
                        alt={s.name}
                        className="w-12 h-9 object-cover rounded-lg bg-slate-100 border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{s.name}</span>
                        <span className="text-[10px] text-slate-500 font-normal line-clamp-1">{s.description}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{s.category}</td>
                    <td className="p-4 font-medium text-slate-700">{s.duration_minutes} Mins</td>
                    <td className="p-4 font-black text-slate-900">${s.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        s.is_active !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-rose-50 text-rose-700 border border-rose-300'
                      }`}>
                        {s.is_active !== false ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all border border-slate-200"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-all border border-rose-200"
                        title="Delete Service"
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

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full p-8 rounded-3xl space-y-6 border border-slate-200 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="font-heading text-xl font-black text-slate-900 uppercase">
                {editingService ? 'Edit Detailing Package' : 'Add New Detailing Package'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Service Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Signature Foam Wash & Ceramic Coating"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Price ($) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as WashCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
                >
                  <option value="Basic Washing" className="bg-white text-slate-900">Basic Washing</option>
                  <option value="Premium Washing" className="bg-white text-slate-900">Premium Washing</option>
                  <option value="Detailing" className="bg-white text-slate-900">Detailing</option>
                  <option value="Ceramic & Polish" className="bg-white text-slate-900">Ceramic & Polish</option>
                  <option value="Add-on Services" className="bg-white text-slate-900">Add-on Services</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider shadow-md shadow-red-600/20"
                >
                  Save Service Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
