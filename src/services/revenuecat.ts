// Temporarily disable RevenueCat to test app loading
// import Purchases, { 
//   CustomerInfo, 
//   PurchasesOffering, 
//   PurchasesPackage,
//   PurchasesEntitlementInfo 
// } from 'react-native-purchases';

// Type definitions only
type CustomerInfo = any;
type PurchasesOffering = any;
type PurchasesPackage = any;
type PurchasesEntitlementInfo = any;
import { REVENUECAT_API_KEY_APPLE, REVENUECAT_API_KEY_GOOGLE, REVENUECAT_OFFERINGS } from '../utils/constants';
import { Platform } from 'react-native';

// Check if RevenueCat is configured (basic check)
let isConfigured = false;

// Initialize RevenueCat
export const initializeRevenueCat = async (userId?: string) => {
  try {
    const apiKey = Platform.select({
      ios: REVENUECAT_API_KEY_APPLE,
      android: REVENUECAT_API_KEY_GOOGLE,
      default: '',
    });

    // Check if API key is configured
    if (!apiKey || apiKey.includes('YOUR_REVENUECAT') || apiKey === '') {
      console.warn('RevenueCat API key not configured, skipping initialization');
      isConfigured = false;
      return false;
    }

    // Temporarily disabled
    // await Purchases.configure({ apiKey });
    isConfigured = false; // Disabled for testing
    return false;
    
    // Identify user if provided
    // if (userId) {
    //   await Purchases.logIn(userId);
    // }

    return true;
  } catch (error) {
    console.error('Error initializing RevenueCat:', error);
    // Don't throw error, just return false to prevent app crash
    return false;
  }
};

// Set user ID for RevenueCat
export const setRevenueCatUserId = async (userId: string) => {
  try {
    if (!isConfigured) {
      throw new Error('RevenueCat is not configured');
    }
    // await Purchases.logIn(userId);
    throw new Error('RevenueCat temporarily disabled');
  } catch (error) {
    console.error('Error setting RevenueCat user ID:', error);
    throw error;
  }
};

// Get customer info
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    if (!isConfigured) {
      return null;
    }
    // const customerInfo = await Purchases.getCustomerInfo();
    return null;
  } catch (error) {
    console.error('Error getting customer info:', error);
    return null;
  }
};

// Check if user has active subscription
export const isSubscriptionActive = async (entitlementIdentifier: string = 'premium'): Promise<boolean> => {
  try {
    if (!isConfigured) {
      return false;
    }
    // const customerInfo = await Purchases.getCustomerInfo();
    return false;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
};

// Get offerings (available subscription plans)
export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  try {
    if (!isConfigured) {
      return null;
    }
    // const offerings = await Purchases.getOfferings();
    return null;
  } catch (error: any) {
    console.error('Error getting offerings:', error);
    // Return null if RevenueCat not configured
    return null;
  }
};

// Purchase a package
export const purchasePackage = async (packageToPurchase: PurchasesPackage): Promise<CustomerInfo> => {
  try {
    if (!isConfigured) {
      throw new Error('RevenueCat is not configured');
    }
    // const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    throw new Error('RevenueCat temporarily disabled');
  } catch (error: any) {
    if (error.userCancelled) {
      throw new Error('User cancelled the purchase');
    } else if (error.paymentPending) {
      throw new Error('Payment is pending');
    }
    console.error('Error purchasing package:', error);
    throw error;
  }
};

// Restore purchases
export const restorePurchases = async (): Promise<CustomerInfo> => {
  try {
    if (!isConfigured) {
      throw new Error('RevenueCat is not configured');
    }
    // const customerInfo = await Purchases.restorePurchases();
    throw new Error('RevenueCat temporarily disabled');
  } catch (error) {
    console.error('Error restoring purchases:', error);
    throw error;
  }
};

// Get current entitlement status
export const getCurrentEntitlement = (customerInfo: CustomerInfo, identifier: string = 'premium'): PurchasesEntitlementInfo | null => {
  return customerInfo.entitlements.active[identifier] || null;
};

// Check if trial period is active
export const isTrialActive = (customerInfo: CustomerInfo): boolean => {
  return customerInfo.entitlements.all['premium']?.willRenew === false 
    && customerInfo.entitlements.all['premium']?.isActive === true;
};

// Get subscription expiration date
export const getExpirationDate = (customerInfo: CustomerInfo, entitlementIdentifier: string = 'premium'): Date | null => {
  const entitlement = customerInfo.entitlements.all[entitlementIdentifier];
  if (entitlement?.expirationDate) {
    return new Date(entitlement.expirationDate);
  }
  return null;
};

// Sign out user
export const logOutRevenueCat = async () => {
  try {
    if (!isConfigured) {
      return;
    }
    // await Purchases.logOut();
  } catch (error) {
    console.error('Error logging out of RevenueCat:', error);
    throw error;
  }
};

