import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseConfigured, memoryStore } from '../config/supabase.js';
import { Car } from '../types/index.js';

export const getCars = async (req: Request, res: Response) => {
  try {
    const { brand, fuel_type, transmission, status, min_price, max_price, search } = req.query;

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('cars').select('*, images:car_images(*)');

        if (brand) query = query.eq('brand', String(brand));
        if (fuel_type) query = query.eq('fuel_type', String(fuel_type));
        if (transmission) query = query.eq('transmission', String(transmission));
        if (status) query = query.eq('status', String(status));
        if (min_price) query = query.gte('price_per_day', Number(min_price));
        if (max_price) query = query.lte('price_per_day', Number(max_price));
        if (search) query = query.ilike('name', `%${search}%`);

        const { data, error } = await query;
        if (!error && data) {
          return res.json({ success: true, count: data.length, data });
        }
      } catch (sbErr) {
        console.warn('[CarsController] Supabase cars table query error, falling back to Memory Store:', sbErr);
      }
    }

    // Memory Store Fallback
    let cars = [...memoryStore.cars];

    if (brand) cars = cars.filter(c => c.brand.toLowerCase() === String(brand).toLowerCase());
    if (fuel_type) cars = cars.filter(c => c.fuel_type === String(fuel_type));
    if (transmission) cars = cars.filter(c => c.transmission === String(transmission));
    if (status) cars = cars.filter(c => c.status === String(status));
    if (min_price) cars = cars.filter(c => c.price_per_day >= Number(min_price));
    if (max_price) cars = cars.filter(c => c.price_per_day <= Number(max_price));
    if (search) {
      const term = String(search).toLowerCase();
      cars = cars.filter(c => c.name.toLowerCase().includes(term) || c.brand.toLowerCase().includes(term));
    }

    return res.json({ success: true, count: cars.length, data: cars });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch cars' });
  }
};

export const getCarById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('cars').select('*, images:car_images(*)').eq('id', id).single();
        if (!error && data) {
          return res.json({ success: true, data });
        }
      } catch (sbErr) {
        console.warn('[CarsController] Supabase fetch error for car id, falling back to Memory Store');
      }
    }

    const car = memoryStore.cars.find(c => c.id === id);
    if (!car) {
      return res.status(404).json({ success: false, error: 'Car not found' });
    }
    return res.json({ success: true, data: car });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch car details' });
  }
};

export const createCar = async (req: Request, res: Response) => {
  try {
    const carData = req.body;
    const newCar: Car = {
      id: uuidv4(),
      name: carData.name || 'New Luxury Vehicle',
      brand: carData.brand || 'Anti Gravity',
      model: carData.model || 'GT',
      year: Number(carData.year || 2026),
      registration_number: carData.registration_number || `AG-${Math.floor(1000 + Math.random() * 9000)}`,
      fuel_type: carData.fuel_type || 'Petrol',
      transmission: carData.transmission || 'Automatic',
      seating_capacity: Number(carData.seating_capacity || 4),
      price_per_day: Number(carData.price_per_day || 250),
      price_per_hour: carData.price_per_hour ? Number(carData.price_per_hour) : undefined,
      description: carData.description || '',
      features: carData.features || ['GPS Navigation', 'Bluetooth', 'Leather Seats'],
      status: carData.status || 'Available',
      maintenance_notes: carData.maintenance_notes || '',
      images: carData.images || [
        {
          id: uuidv4(),
          car_id: '',
          image_url: carData.image_url || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
          is_primary: true,
        }
      ]
    };

    let insertedToSupabase = false;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('cars').insert({
          id: newCar.id,
          name: newCar.name,
          brand: newCar.brand,
          model: newCar.model,
          year: newCar.year,
          registration_number: newCar.registration_number,
          fuel_type: newCar.fuel_type,
          transmission: newCar.transmission,
          seating_capacity: newCar.seating_capacity,
          price_per_day: newCar.price_per_day,
          price_per_hour: newCar.price_per_hour,
          description: newCar.description,
          features: newCar.features,
          status: newCar.status,
          maintenance_notes: newCar.maintenance_notes
        });
        if (!error) insertedToSupabase = true;
      } catch (sbErr) {
        console.warn('[CarsController] Supabase insert failed, storing in memory store:', sbErr);
      }
    }

    // Always ensure memoryStore is populated so local preview works 100%
    if (!insertedToSupabase || !memoryStore.cars.some(c => c.id === newCar.id)) {
      memoryStore.cars.unshift(newCar);
    }

    return res.status(201).json({ success: true, message: 'Car added to inventory successfully', data: newCar });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message || 'Failed to create car entry' });
  }
};

export const updateCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let updatedCar: Car | null = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('cars').update(updates).eq('id', id).select().single();
        if (!error && data) updatedCar = data as Car;
      } catch (sbErr) {
        console.warn('[CarsController] Supabase update failed, updating memory store');
      }
    }

    const index = memoryStore.cars.findIndex(c => c.id === id);
    if (index !== -1) {
      memoryStore.cars[index] = { ...memoryStore.cars[index], ...updates };
      if (!updatedCar) updatedCar = memoryStore.cars[index];
    }

    if (!updatedCar) {
      return res.status(404).json({ success: false, error: 'Car not found' });
    }

    return res.json({ success: true, message: 'Car updated successfully', data: updatedCar });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message || 'Failed to update car' });
  }
};

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('cars').delete().eq('id', id);
      } catch (sbErr) {
        console.warn('[CarsController] Supabase delete error, deleting from memory store');
      }
    }

    memoryStore.cars = memoryStore.cars.filter(c => c.id !== id);
    return res.json({ success: true, message: 'Car deleted from inventory' });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message || 'Failed to delete car' });
  }
};
