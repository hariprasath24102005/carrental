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
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-slate-50 text-slate-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-red-600 font-bold uppercase tracking-widest block">Inventory Management</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">CAR RENTAL FLEET</h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-red-600/20 hover:scale-105 transition-all uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          Add New Vehicle
        </button>
      </div>

      {/* TABLE (HIGH-VISIBILITY BLACK ON WHITE) */}
      {loading ? (
        <div className="h-64 rounded-3xl bg-slate-200/60 animate-pulse" />
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-100 text-slate-900 font-black uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Reg Number</th>
                  <th className="p-4">Powertrain</th>
                  <th className="p-4">Daily Rate</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={car.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80'}
                        alt={car.name}
                        className="w-12 h-9 object-cover rounded-lg bg-slate-100 border border-slate-200"
                      />
                      <div>
                        <span className="text-slate-900 font-bold block">{car.brand} {car.name}</span>
                        <span className="block text-[10px] text-slate-500 font-medium">{car.year} | {car.transmission}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-red-600">{car.registration_number}</td>
                    <td className="p-4 font-medium text-slate-700">{car.fuel_type}</td>
                    <td className="p-4 font-black text-slate-900">${car.price_per_day}/day</td>
                    <td className="p-4">
                      <select
                        value={car.status}
                        onChange={(e) => handleStatusChange(car.id, e.target.value as CarStatus)}
                        className={`border rounded-xl px-2.5 py-1 text-[11px] font-bold focus:outline-none cursor-pointer ${
                          car.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : car.status === 'Booked'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}
                      >
                        <option value="Available" className="bg-white text-slate-900">Available</option>
                        <option value="Booked" className="bg-white text-slate-900">Booked</option>
                        <option value="Maintenance" className="bg-white text-slate-900">Maintenance</option>
                        <option value="Temporarily Unavailable" className="bg-white text-slate-900">Unavailable</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(car)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all border border-slate-200"
                        title="Edit Car Details & Image"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-all border border-rose-200"
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full p-8 rounded-3xl space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="font-heading text-xl font-black text-slate-900 uppercase">
                {editingCar ? 'Edit Vehicle Entry' : 'Add New Vehicle to Inventory'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Car Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="911 Carrera S"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Brand *</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Porsche"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Carrera S"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Registration # *</label>
                  <input
                    type="text"
                    value={regNum}
                    onChange={(e) => setRegNum(e.target.value)}
                    placeholder="AG-P911-24"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as FuelType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
                  >
                    <option value="Petrol" className="bg-white text-slate-900">Petrol</option>
                    <option value="Electric" className="bg-white text-slate-900">Electric</option>
                    <option value="Hybrid" className="bg-white text-slate-900">Hybrid</option>
                    <option value="Diesel" className="bg-white text-slate-900">Diesel</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
                  >
                    <option value="Automatic" className="bg-white text-slate-900">Automatic</option>
                    <option value="Manual" className="bg-white text-slate-900">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Price / Day ($) *</label>
                  <input
                    type="number"
                    value={priceDay}
                    onChange={(e) => setPriceDay(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
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

              <div>
                <label className="text-slate-700 font-bold block mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Sport Chrono, Bose Audio, Leather Seats"
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
