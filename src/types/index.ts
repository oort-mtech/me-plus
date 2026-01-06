// User types
export interface User {
  id: string;
  email: string;
  age?: number;
  height?: number;
  currentWeight?: number;
  gender?: 'male' | 'female' | 'other';
  createdAt: string;
  updatedAt: string;
}

// Goal types
export interface Goal {
  id: string;
  userId: string;
  targetWeight: number;
  currentWeight: number;
  startDate: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Food/Macro types
export interface FoodEntry {
  id: string;
  userId: string;
  imageUrl?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  createdAt: string;
}

// Progress types
export interface ProgressData {
  date: string;
  weight: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Subscription types
export type SubscriptionPlan = 'free' | 'monthly' | 'yearly' | 'lifetime';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  trialEndDate?: string;
  originalTransactionId?: string;
  productIdentifier?: string;
}

// RevenueCat types
export interface RevenueCatInfo {
  isActive: boolean;
  willRenew: boolean;
  isSandbox: boolean;
  expirationDate?: string;
  periodType: 'NORMAL' | 'TRIAL' | 'INTRO';
  productIdentifier?: string;
}

// Navigation types
export type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  SignIn: undefined;
  Onboarding: undefined;
  Home: undefined;
  Profile: undefined;
  Goals: undefined;
  Camera: undefined;
  Progress: undefined;
  PhotoAnalysis: undefined;
  Subscription: undefined;
};

