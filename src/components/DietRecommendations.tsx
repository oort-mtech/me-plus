import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { authService, foodService, userService, goalsService } from '../services/supabase';
import { COLORS } from '../utils/constants';
import { User, Goal, FoodEntry } from '../types';

export default function DietRecommendations() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateRecommendations();
  }, []);

  const generateRecommendations = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;

      const [profile, goal, todayEntries] = await Promise.all([
        userService.getProfile(user.id).catch(() => null),
        goalsService.getGoal(user.id).catch(() => null),
        foodService.getFoodEntries(user.id, new Date().toISOString().split('T')[0]).catch(() => []),
      ]);

      const recs: string[] = [];

      if (!profile) {
        recs.push('Complete your profile to get personalized recommendations');
        setRecommendations(recs);
        setLoading(false);
        return;
      }

      // Calculate daily macros from today's entries
      const todayCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
      const todayProtein = todayEntries.reduce((sum, entry) => sum + entry.protein, 0);
      const todayCarbs = todayEntries.reduce((sum, entry) => sum + entry.carbs, 0);
      const todayFat = todayEntries.reduce((sum, entry) => sum + entry.fat, 0);

      // Calculate recommended calories (simplified BMR + activity)
      const age = profile.age || 30;
      const weight = profile.currentWeight || 70;
      const height = profile.height || 170;
      const isMale = profile.gender === 'male';

      // Simplified BMR calculation (Mifflin-St Jeor Equation)
      let bmr = isMale
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

      // Apply activity factor (sedentary = 1.2)
      const dailyCalories = bmr * 1.2;

      // If goal exists, adjust for weight loss (500 calorie deficit)
      const targetCalories = goal ? dailyCalories - 500 : dailyCalories;
      const targetProtein = weight * 2.2; // 1g per lb body weight
      const targetCarbs = (targetCalories * 0.4) / 4; // 40% of calories
      const targetFat = (targetCalories * 0.25) / 9; // 25% of calories

      // Generate recommendations based on current intake
      if (todayCalories === 0) {
        recs.push('Start tracking your meals to get personalized recommendations');
      } else {
        if (goal) {
          const caloriesRemaining = targetCalories - todayCalories;
          if (caloriesRemaining > 200) {
            recs.push(`You have ${Math.round(caloriesRemaining)} calories remaining today. Consider a healthy snack.`);
          } else if (caloriesRemaining < -200) {
            recs.push(`You've exceeded your daily calorie target. Focus on lean proteins and vegetables for remaining meals.`);
          } else {
            recs.push('Great job staying within your calorie target!');
          }
        }

        const proteinDiff = targetProtein - todayProtein;
        if (proteinDiff > 30) {
          recs.push(`Add ${Math.round(proteinDiff)}g more protein today. Try lean meats, fish, or plant-based proteins.`);
        } else if (proteinDiff < -20) {
          recs.push('You\'ve exceeded your protein target. Balance with more vegetables and whole grains.');
        } else if (proteinDiff > 0) {
          recs.push('Your protein intake is on track!');
        }

        const carbDiff = targetCarbs - todayCarbs;
        if (carbDiff > 50) {
          recs.push(`Include more complex carbs like whole grains, sweet potatoes, or quinoa (${Math.round(carbDiff)}g remaining).`);
        } else if (todayCarbs > targetCarbs * 1.5) {
          recs.push('Consider reducing refined carbs and focus on complex carbohydrates.');
        }

        const fatDiff = targetFat - todayFat;
        if (fatDiff > 20) {
          recs.push(`Add healthy fats like avocado, nuts, or olive oil (${Math.round(fatDiff)}g remaining).`);
        }

        // Meal timing recommendations
        if (todayEntries.length === 0) {
          recs.push('Remember to log all your meals throughout the day for accurate tracking.');
        } else if (todayEntries.length < 3) {
          recs.push('Aim for 3-5 balanced meals per day to maintain stable energy levels.');
        }
      }

      // General recommendations
      if (goal) {
        recs.push('Maintain a consistent calorie deficit to achieve your weight loss goal.');
        recs.push('Stay hydrated - drink at least 2-3 liters of water daily.');
      }

      if (recs.length === 0) {
        recs.push('Keep tracking your meals and stay consistent with your nutrition plan!');
      }

      setRecommendations(recs);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setRecommendations(['Unable to generate recommendations at this time.']);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Diet Recommendations</Text>
      <ScrollView style={styles.recommendationsList}>
        {recommendations.map((rec, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Text style={styles.recommendationBullet}>💡</Text>
            <Text style={styles.recommendationText}>{rec}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  recommendationsList: {
    maxHeight: 300,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  recommendationBullet: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});


