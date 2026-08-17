import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseConfigured, memoryStore } from '../config/supabase.js';
import { WashService } from '../types/index.js';

export const getWashServices = async (req: Request, res: Response) => {
  try {
    const { category, is_active } = req.query;

    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('wash_services').select('*');
      if (category) query = query.eq('category', String(category));
      if (is_active !== undefined) query = query.eq('is_active', is_active === 'true');

      const { data, error } = await query;
      if (error) throw error;
      return res.json({ success: true, count: data.length, data });
    } else {
      let services = [...memoryStore.washServices];
      if (category) services = services.filter(s => s.category.toLowerCase() === String(category).toLowerCase());
      if (is_active !== undefined) services = services.filter(s => s.is_active === (is_active === 'true'));

      return res.json({ success: true, count: services.length, data: services });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch washing services' });
  }
};

export const createWashService = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newService: WashService = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      price: Number(data.price),
      duration_minutes: Number(data.duration_minutes || 45),
      image_url: data.image_url || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
      category: data.category || 'Premium Washing',
      is_active: data.is_active !== undefined ? data.is_active : true,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('wash_services').insert(newService);
      if (error) throw error;
    } else {
      memoryStore.washServices.push(newService);
    }

    return res.status(201).json({ success: true, message: 'Washing service added successfully', data: newService });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message || 'Failed to create washing service' });
  }
};

export const updateWashService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('wash_services').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.json({ success: true, message: 'Washing service updated successfully', data });
    } else {
      const index = memoryStore.washServices.findIndex(s => s.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Washing service not found' });
      }
      memoryStore.washServices[index] = { ...memoryStore.washServices[index], ...updates };
      return res.json({ success: true, message: 'Washing service updated successfully', data: memoryStore.washServices[index] });
    }
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message || 'Failed to update washing service' });
  }
};

export const deleteWashService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('wash_services').delete().eq('id', id);
      if (error) throw error;
    } else {
      memoryStore.washServices = memoryStore.washServices.filter(s => s.id !== id);
    }

    return res.json({ success: true, message: 'Washing service deleted' });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message || 'Failed to delete service' });
  }
};
