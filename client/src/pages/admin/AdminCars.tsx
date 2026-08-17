import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Car, FuelType, TransmissionType, CarStatus } from '../../types';
import { Plus, Edit2, Trash2, X, Check, Car as CarIcon, AlertCircle } from 'lucide-react';

export const AdminCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2024);
  const [regNum, setRegNum] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [transmission, setTransmission] = useState<TransmissionType>('Automatic');
  const [seating, setSeating] = useState(5);
  const [priceDay, setPriceDay] = useState(250);
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<CarStatus>('Available');

  const fetchCars = async () => {
    try {
      const data = await api.getCars();
      setCars(data);
    } catch (err) {
      console.error('Failed to fetch cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const resetForm = () => {
    setName('');
    setBrand('');
    setModel('');
    setYear(2024);
    setRegNum('');
    setFuelType('Petrol');
    setTransmission('Automatic');
    setSeating(5);
    setPriceDay(250);
    setDescription('');
    setFeatures('');
    setImageUrl('');
    setStatus('Available');
    setEditingCar(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (car: Car) => {
    setEditingCar(car);
    setName(car.name);
    setBrand(car.brand);
    setModel(car.model);
    setYear(car.year);
    setRegNum(car.registration_number);
    setFuelType(car.fuel_type);
    setTransmission(car.transmission);
    setSeating(car.seating_capacity);
    setPriceDay(car.price_per_day);
    setDescription(car.description);
    setFeatures(car.features.join(', '));
    setImageUrl(car.images?.[0]?.image_url || '');
    setStatus(car.status);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const featArray = features.split(',').map(f => f.trim()).filter(Boolean);

    const payload: Partial<Car> = {
      name,
      brand,
      model,
      year: Number(year),
      registration_number: regNum,
      fuel_type: fuelType,
      transmission,
      seating_capacity: Number(seating),
      price_per_day: Number(priceDay),
      description,
      features: featArray,
      status,
      ...(imageUrl ? { images: [{ car_id: editingCar?.id || '', image_url: imageUrl, is_primary: true }] } : {})
    };

    try {
      if (editingCar) {
        await api.updateCar(editingCar.id, payload);
      } else {
        await api.createCar(payload);
      }
      setShowModal(false);
      resetForm();
      fetchCars();
    } catch (err: any) {
      alert(err.message || 'Failed to save car');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this car from inventory?')) {
      try {
        await api.deleteCar(id);
        fetchCars();
      } catch (err: any) {
        alert(err.message || 'Failed to delete car');
      }
    }
  };

  const handleStatusChange = async (carId: string, newStatus: CarStatus) => {
    try {
      await api.updateCar(carId, { status: newStatus });
      fetchCars();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-ag-cyan font-bold uppercase tracking-widest block">Inventory Management</span>
          <h1 className="font-heading text-3xl font-black text-white">CAR RENTAL FLEET</h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-ag-cyan to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md cyan-glow hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Vehicle
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="h-64 rounded-3xl bg-ag-surface/50 animate-pulse" />
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-ag-border/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-ag-surface/80 text-white font-bold uppercase text-[10px] tracking-wider border-b border-ag-border">
                <tr>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Reg Number</th>
                  <th className="p-4">Powertrain</th>
                  <th className="p-4">Daily Rate</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ag-border/50">
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-ag-surface/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <img
                        src={car.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80'}
                        alt={car.name}
                        className="w-12 h-9 object-cover rounded-lg bg-ag-surface"
                      />
                      <div>
                        <span>{car.brand} {car.name}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">{car.year} | {car.transmission}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-ag-cyan">{car.registration_number}</td>
                    <td className="p-4">{car.fuel_type}</td>
                    <td className="p-4 font-bold text-white">${car.price_per_day}/day</td>
                    <td className="p-4">
                      <select
                        value={car.status}
                        onChange={(e) => handleStatusChange(car.id, e.target.value as CarStatus)}
                        className="bg-ag-surface border border-ag-border rounded-lg px-2.5 py-1 text-[11px] font-bold text-white focus:outline-none"
                      >
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Temporarily Unavailable">Unavailable</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(car)}
                        className="p-2 rounded-lg bg-ag-surface hover:bg-ag-border text-slate-300 hover:text-white"
                        title="Edit Car"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        title="Delete Car"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-2xl w-full p-8 rounded-3xl space-y-6 max-h-[90vh] overflow-y-auto border border-ag-cyan/40">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold text-white">
                {editingCar ? 'Edit Vehicle Entry' : 'Add New Vehicle to Inventory'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Car Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="911 Carrera S"
                    required
                    className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Brand *</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Porsche"
                    required
                    className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Carrera S"
                    className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Registration # *</label>
                  <input
                    type="text"
                    value={regNum}
                    onChange={(e) => setRegNum(e.target.value)}
                    placeholder="AG-P911-24"
                    required
                    className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as FuelType)}
                    className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                    className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Price / Day ($) *</label>
                  <input
                    type="number"
                    value={priceDay}
                    onChange={(e) => setPriceDay(Number(e.target.value))}
                    required
                    className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                  />
                </div>
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

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-ag-surface border border-ag-border rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Sport Chrono, Bose Audio, Leather Seats"
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
                  className="px-6 py-2.5 rounded-xl bg-ag-cyan text-slate-950 font-bold"
                >
                  Save Car Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
