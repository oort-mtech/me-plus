import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, User, Goal } from '../types';
import { userService, authService, goalsService } from '../services/supabase';
import { COLORS } from '../utils/constants';
import DietRecommendations from '../components/DietRecommendations';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [user, setUser] = useState<User | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        navigation.navigate('SignIn');
        return;
      }

      const [profile, userGoal] = await Promise.all([
        userService.getProfile(currentUser.id).catch(() => null),
        goalsService.getGoal(currentUser.id).catch(() => null),
      ]);

      setUser(profile);
      setGoal(userGoal);
    } catch (error: any) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!goal || !user?.currentWeight) return 0;
    const totalChange = Math.abs(goal.targetWeight - goal.currentWeight);
    const currentChange = Math.abs(goal.targetWeight - user.currentWeight);
    if (totalChange === 0) return 100;
    return Math.min(100, Math.max(0, (currentChange / totalChange) * 100));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const progress = calculateProgress();
  const weightToLose = goal && user?.currentWeight
    ? (user.currentWeight - goal.targetWeight).toFixed(1)
    : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back!</Text>
        {user && <Text style={styles.subtitle}>{user.email}</Text>}
      </View>

      {!user?.age && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.cardTitle}>Complete Your Profile</Text>
          <Text style={styles.cardText}>
            Add your age, height, weight, and gender to get started
          </Text>
        </TouchableOpacity>
      )}

      {!goal && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Goals')}
        >
          <Text style={styles.cardTitle}>Set Your Goal</Text>
          <Text style={styles.cardText}>
            Define your weight loss target and start tracking your progress
          </Text>
        </TouchableOpacity>
      )}

      {goal && user && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Goal</Text>
          <View style={styles.goalInfo}>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Current Weight</Text>
              <Text style={styles.goalValue}>{user.currentWeight} kg</Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Target Weight</Text>
              <Text style={styles.goalValue}>{goal.targetWeight} kg</Text>
            </View>
            {weightToLose && parseFloat(weightToLose) > 0 && (
              <View style={styles.goalItem}>
                <Text style={styles.goalLabel}>Weight to Lose</Text>
                <Text style={styles.goalValue}>{weightToLose} kg</Text>
              </View>
            )}
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress.toFixed(0)}% towards goal</Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Text style={styles.actionButtonText}>📸 Scan Food</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Progress')}
        >
          <Text style={styles.actionButtonText}>📈 View Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('PhotoAnalysis')}
        >
          <Text style={styles.actionButtonText}>📷 Photo Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.actionButtonText}>👤 Profile</Text>
        </TouchableOpacity>
      </View>

      <DietRecommendations />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  goalItem: {
    alignItems: 'center',
  },
  goalLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  goalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

