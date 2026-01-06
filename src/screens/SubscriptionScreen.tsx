import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRevenueCat } from '../hooks/useRevenueCat';
import { COLORS } from '../utils/constants';
// Temporarily disable type imports
// import type { PurchasesPackage } from 'react-native-purchases';
type PurchasesPackage = any;

export default function SubscriptionScreen() {
  const { 
    isLoading, 
    offerings, 
    isPremium, 
    purchase, 
    restore 
  } = useRevenueCat();

  const handlePurchase = async (pkg: PurchasesPackage | any) => {
    try {
      await purchase(pkg);
      Alert.alert('Success', 'Purchase successful!');
    } catch (error: any) {
      if (error.message?.includes('cancelled')) {
        Alert.alert('Purchase Cancelled', 'You cancelled the purchase');
      } else {
        Alert.alert('Purchase Failed', error.message || 'Something went wrong');
      }
    }
  };

  const handleRestore = async () => {
    try {
      await restore();
      Alert.alert('Success', 'Purchases restored successfully!');
    } catch (error) {
      Alert.alert('Restore Failed', 'Unable to restore purchases');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (isPremium) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.premiumContainer}>
          <Text style={styles.premiumTitle}>You're Premium! ✨</Text>
          <Text style={styles.premiumText}>
            Thank you for subscribing to me-plus
          </Text>
        </View>
      </ScrollView>
    );
  }

  const packages = offerings?.availablePackages || [];

  if (packages.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>No Subscription Plans Available</Text>
          <Text style={styles.subtitle}>
            Configure your products in RevenueCat dashboard
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upgrade to Premium</Text>
        <Text style={styles.subtitle}>
          Unlock all features and track your body recomposition journey
        </Text>
      </View>

      <View style={styles.packagesContainer}>
        {packages.map((pkg: any) => (
          <TouchableOpacity
            key={pkg.identifier}
            style={styles.packageCard}
            onPress={() => handlePurchase(pkg)}
            disabled={isLoading}
          >
            <View style={styles.packageInfo}>
              <Text style={styles.packageName}>{pkg.identifier.toUpperCase()}</Text>
              <Text style={styles.packageDescription}>
                {pkg.identifier.replace('_', ' ')}
              </Text>
              <Text style={styles.packagePrice}>
                {pkg.product.priceString}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.restoreButton}
        onPress={handleRestore}
        disabled={isLoading}
      >
        <Text style={styles.restoreButtonText}>Restore Purchases</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Subscriptions automatically renew. Cancel anytime in your account settings.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  premiumContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  premiumTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  premiumText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  header: {
    marginBottom: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  packagesContainer: {
    marginBottom: 24,
  },
  packageCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  packageInfo: {
    gap: 8,
  },
  packageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  packageDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  restoreButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 32,
  },
});

