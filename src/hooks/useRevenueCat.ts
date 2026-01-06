import { useEffect, useState } from 'react';
import { 
  initializeRevenueCat, 
  getCustomerInfo,
  isSubscriptionActive,
  getOfferings,
  purchasePackage,
  restorePurchases,
} from '../services/revenuecat';
// Temporarily disable type imports
// import type { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
type CustomerInfo = any;
type PurchasesOffering = any;
type PurchasesPackage = any;

export const useRevenueCat = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Don't initialize automatically - only when explicitly needed
    // initialize();
    setIsInitialized(true);
    setIsLoading(false);
  }, []);

  const initialize = async () => {
    try {
      setIsLoading(true);
      
      // Add timeout to prevent hanging
      const initPromise = initializeRevenueCat();
      const timeoutPromise = new Promise<boolean>((resolve) => 
        setTimeout(() => resolve(false), 5000)
      );
      
      const initialized = await Promise.race([initPromise, timeoutPromise]);
      
      if (!initialized) {
        console.log('RevenueCat not configured or timed out, using fallback mode');
        setIsInitialized(true);
        setIsLoading(false);
        return;
      }

      // Add timeout for subsequent calls (use Promise.race with timeout)
      const timeout = 3000; // 3 second timeout
      const timeoutPromise = <T>(promise: Promise<T>, defaultValue: T): Promise<T> => {
        return Promise.race([
          promise,
          new Promise<T>((resolve) => setTimeout(() => resolve(defaultValue), timeout))
        ]);
      };

      const [info, offeringsData, premiumStatus] = await Promise.all([
        timeoutPromise(getCustomerInfo(), null),
        timeoutPromise(getOfferings(), null),
        timeoutPromise(isSubscriptionActive('premium'), false),
      ]);

      setCustomerInfo(info);
      setOfferings(offeringsData);
      setIsPremium(premiumStatus);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
      setIsInitialized(true); // Set as initialized even on error
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCustomerInfo = async () => {
    try {
      const info = await getCustomerInfo();
      const premiumStatus = await isSubscriptionActive('premium');

      setCustomerInfo(info);
      setIsPremium(premiumStatus);
      return info;
    } catch (error) {
      console.error('Error refreshing customer info:', error);
      throw error;
    }
  };

  const purchase = async (packageToPurchase: PurchasesPackage) => {
    try {
      setIsLoading(true);
      const info = await purchasePackage(packageToPurchase);
      const premiumStatus = await isSubscriptionActive('premium');

      setCustomerInfo(info);
      setIsPremium(premiumStatus);
      return info;
    } catch (error) {
      console.error('Error purchasing:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const restore = async () => {
    try {
      setIsLoading(true);
      const info = await restorePurchases();
      const premiumStatus = await isSubscriptionActive('premium');

      setCustomerInfo(info);
      setIsPremium(premiumStatus);
      return info;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOfferings = async () => {
    try {
      const offeringsData = await getOfferings();
      setOfferings(offeringsData);
      return offeringsData;
    } catch (error) {
      console.error('Error refreshing offerings:', error);
      throw error;
    }
  };

  return {
    isInitialized,
    isLoading,
    customerInfo,
    offerings,
    isPremium,
    refreshCustomerInfo,
    purchase,
    restore,
    refreshOfferings,
  };
};

