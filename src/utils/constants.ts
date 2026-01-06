// Constants for the app

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  background: '#F2F2F7',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    price: 9.69,
    interval: 'month',
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly',
    price: 69.99,
    interval: 'year',
  },
  lifetime: {
    id: 'lifetime',
    name: 'Lifetime',
    price: 99.69,
    interval: 'lifetime',
  },
} as const;

export const TRIAL_DAYS = 7;

// RevenueCat configuration (replace with your actual keys)
export const REVENUECAT_API_KEY_APPLE = 'YOUR_REVENUECAT_APPLE_KEY_HERE';
export const REVENUECAT_API_KEY_GOOGLE = 'test_qtIXzWfxchDVfxgTjftKCDKyMtX';

// RevenueCat Offerings configuration
export const REVENUECAT_OFFERINGS = {
  identifier: 'default', // This should match your RevenueCat dashboard
  packages: {
    monthly: 'monthly',
    yearly: 'yearly',
    lifetime: 'lifetime',
  },
} as const;

// Supabase configuration (replace with your actual values)
export const SUPABASE_CONFIG = {
  url: 'https://xjwkqpgmssdomaydpnee.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqd2txcGdtc3Nkb21heWRwbmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NjU2MDQsImV4cCI6MjA3NzA0MTYwNH0.Y7iyIS2hAkDpuVg80W9ggRsVgE4z7EwuZ4ccCb_c-rM',
};

