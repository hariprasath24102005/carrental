import React, { useEffect, useState } from 'react';
import { CarCard } from '../../components/CarCard';
import { api } from '../../services/api';
import { Car } from '../../types';
import { Search, Filter, Fuel, RotateCcw, SlidersHorizontal } from 'lucide-react';

export const CarsPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [maxPrice, setMaxPrice] = useState(1000);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (selectedBrand) params.brand = selectedBrand;
      if (selectedFuel) params.fuel_type = selectedFuel;
      if (selectedTransmission) params.transmission = selectedTransmission;
      if (maxPrice < 1000) params.max_price = String(maxPrice);

      const data = await api.getCars(params);
      setCars(data);
    } catch (err) {
      console.error('Failed to fetch cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [search, selectedBrand, selectedFuel, selectedTransmission, maxPrice]);

  const resetFilters = () => {
    setSearch('');
    setSelectedBrand('');
    setSelectedFuel('');
    setSelectedTransmission('');
    setMaxPrice(1000);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* PAGE HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs text-ag-cyan font-bold uppercase tracking-widest block">Exotic & Luxury Inventory</span>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-white">
          OUR RENTAL FLEET
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Browse our collection of high-performance sports cars, luxury sedans, and executive SUVs available for daily and hourly rental.
        </p>
      </div>

      {/* FILTER BAR PANEL */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-ag-border/80">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* SEARCH INPUT */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by car name, brand, or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ag-surface/80 border border-ag-border rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-ag-cyan transition-colors"
            />
          </div>

          {/* BRAND SELECT */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full md:w-48 bg-ag-surface/80 border border-ag-border rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ag-cyan"
          >
            <option value="">All Brands</option>
            <option value="Porsche">Porsche</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Tesla">Tesla</option>
            <option value="BMW">BMW</option>
            <option value="Land Rover">Land Rover</option>
            <option value="Audi">Audi</option>
          </select>

          {/* FUEL SELECT */}
          <select
            value={selectedFuel}
            onChange={(e) => setSelectedFuel(e.target.value)}
            className="w-full md:w-44 bg-ag-surface/80 border border-ag-border rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ag-cyan"
          >
            <option value="">All Powertrains</option>
            <option value="Petrol">Petrol</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Diesel">Diesel</option>
          </select>

          {/* RESET BUTTON */}
          <button
            onClick={resetFilters}
            className="w-full md:w-auto px-4 py-3 rounded-2xl bg-ag-surface hover:bg-ag-border text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 border border-ag-border"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

        </div>
      </div>

      {/* CAR GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-ag-surface/50 animate-pulse" />
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl space-y-3">
          <p className="text-lg font-bold text-white">No cars match your search filters.</p>
          <p className="text-sm text-slate-400">Try adjusting your brand, fuel type, or keyword query.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-6 py-2.5 rounded-xl bg-ag-cyan text-slate-950 font-bold text-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}

    </div>
  );
};
