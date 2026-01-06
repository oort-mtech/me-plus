import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Goal } from '../types';
import { authService, goalsService, userService } from '../services/supabase';
import { COLORS } from '../utils/constants';

type GoalsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Goals'>;
};

export default function GoalsScreen({ navigation }: GoalsScreenProps) {
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [existingGoal, setExistingGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGoal();
  }, []);

  const loadGoal = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        navigation.navigate('SignIn');
        return;
      }

      const profile = await userService.getProfile(user.id).catch(() => null);
      const goal = await goalsService.getGoal(user.id).catch(() => null);

      if (goal) {
        setExistingGoal(goal);
        setCurrentWeight(goal.currentWeight.toString());
        setTargetWeight(goal.targetWeight.toString());
      } else if (profile?.currentWeight) {
        setCurrentWeight(profile.currentWeight.toString());
      }
    } catch (error: any) {
      console.error('Error loading goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoal = async () => {
    if (!currentWeight || !targetWeight) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const currentWeightNum = parseFloat(currentWeight);
    const targetWeightNum = parseFloat(targetWeight);

    if (isNaN(currentWeightNum) || currentWeightNum < 20 || currentWeightNum > 500) {
      Alert.alert('Error', 'Please enter a valid current weight (in kg)');
      return;
    }

    if (isNaN(targetWeightNum) || targetWeightNum < 20 || targetWeightNum > 500) {
      Alert.alert('Error', 'Please enter a valid target weight (in kg)');
      return;
    }

    if (targetWeightNum >= currentWeightNum) {
      Alert.alert('Error', 'Target weight should be less than current weight for weight loss');
      return;
    }

    setSaving(true);
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      const goalData = {
        userId: user.id,
        currentWeight: currentWeightNum,
        targetWeight: targetWeightNum,
        startDate: new Date().toISOString().split('T')[0],
      };

      if (existingGoal) {
        await goalsService.updateGoal(existingGoal.id, {
          currentWeight: currentWeightNum,
          targetWeight: targetWeightNum,
        });
        Alert.alert('Success', 'Goal updated successfully');
      } else {
        await goalsService.createGoal(goalData);
        Alert.alert('Success', 'Goal set successfully');
      }

      // Update user profile weight as well
      await userService.updateProfile(user.id, {
        currentWeight: currentWeightNum,
      });

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save goal');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const weightToLose = currentWeight && targetWeight
    ? (parseFloat(currentWeight) - parseFloat(targetWeight)).toFixed(1)
    : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        <Text style={styles.title}>Set Your Weight Loss Goal</Text>
        <Text style={styles.subtitle}>
          How much weight would you like to lose?
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your current weight"
              value={currentWeight}
              onChangeText={setCurrentWeight}
              keyboardType="decimal-pad"
              autoComplete="off"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your target weight"
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="decimal-pad"
              autoComplete="off"
            />
          </View>

          {weightToLose && parseFloat(weightToLose) > 0 && (
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                You want to lose <Text style={styles.summaryHighlight}>{weightToLose} kg</Text>
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleSaveGoal}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? 'Saving...' : existingGoal ? 'Update Goal' : 'Set Goal'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  summary: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 18,
    color: COLORS.text,
  },
  summaryHighlight: {
    fontWeight: 'bold',
    color: COLORS.primary,
    fontSize: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});


