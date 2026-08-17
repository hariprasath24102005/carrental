import { Request, Response } from 'express';
import { supabase, isSupabaseConfigured, memoryStore } from '../config/supabase.js';

export const getBusinessSettings = async (req: Request, res: Response) => {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('business_settings').select('*').limit(1).single();
      if (!error && data) {
        return res.json({ success: true, data });
      }
    }
    return res.json({ success: true, data: memoryStore.businessSettings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch settings' });
  }
};

export const updateBusinessSettings = async (req: Request, res: Response) => {
  try {
    const updates = req.body;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('business_settings')
        .update(updates)
        .eq('id', memoryStore.businessSettings.id)
        .select()
        .single();

      if (error) throw error;
      return res.json({ success: true, message: 'Settings updated', data });
    } else {
      memoryStore.businessSettings = { ...memoryStore.businessSettings, ...updates };
      return res.json({ success: true, message: 'Settings updated', data: memoryStore.businessSettings });
    }
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message || 'Failed to update business settings' });
  }
};
