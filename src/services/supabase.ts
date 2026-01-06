import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase URL and key
const SUPABASE_URL = 'https://xjwkqpgmssdomaydpnee.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqd2txcGdtc3Nkb21heWRwbmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NjU2MDQsImV4cCI6MjA3NzA0MTYwNH0.Y7iyIS2hAkDpuVg80W9ggRsVgE4z7EwuZ4ccCb_c-rM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// User service
export const userService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// Auth service
export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
};

// Food service
export const foodService = {
  async addFoodEntry(entry: Omit<import('../types').FoodEntry, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('food_entries')
      .insert(entry)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getFoodEntries(userId: string, date: string) {
    const { data, error } = await supabase
      .from('food_entries')
      .select('*')
      .eq('userId', userId)
      .eq('date', date);
    
    if (error) throw error;
    return data;
  },
};

// Goals service
export const goalsService = {
  async getGoal(userId: string) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createGoal(goal: Omit<import('../types').Goal, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('goals')
      .insert(goal)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateGoal(goalId: string, updates: any) {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', goalId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

