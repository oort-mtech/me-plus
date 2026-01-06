import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, FoodEntry, Goal } from '../types';
import { authService, foodService, goalsService } from '../services/supabase';
import { COLORS } from '../utils/constants';

type ProgressScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Progress'>;
};

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen({ navigation }: ProgressScreenProps) {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        navigation.navigate('SignIn');
        return;
      }

      // Get entries for the last 7 days
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      });

      const entriesPromises = dates.map((date) =>
        foodService.getFoodEntries(user.id, date).catch(() => [])
      );

      const entriesArrays = await Promise.all(entriesPromises);
      const allEntries = entriesArrays.flat();

      setFoodEntries(allEntries);

      const userGoal = await goalsService.getGoal(user.id).catch(() => null);
      setGoal(userGoal);
    } catch (error: any) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyData = last7Days.map((date) => {
      const dayEntries = foodEntries.filter((entry) => entry.date === date);
      return {
        date,
        calories: dayEntries.reduce((sum, entry) => sum + entry.calories, 0),
        protein: dayEntries.reduce((sum, entry) => sum + entry.protein, 0),
        carbs: dayEntries.reduce((sum, entry) => sum + entry.carbs, 0),
        fat: dayEntries.reduce((sum, entry) => sum + entry.fat, 0),
      };
    });

    return {
      labels: last7Days.map((date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { weekday: 'short' });
      }),
      calories: dailyData.map((d) => d.calories),
      protein: dailyData.map((d) => d.protein),
      carbs: dailyData.map((d) => d.carbs),
      fat: dailyData.map((d) => d.fat),
    };
  };

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: COLORS.primary,
    },
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const data = processData();
  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = foodEntries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = foodEntries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFat = foodEntries.reduce((sum, entry) => sum + entry.fat, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress & Statistics</Text>
        <Text style={styles.subtitle}>Last 7 days overview</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Calories</Text>
        <LineChart
          data={{
            labels: data.labels,
            datasets: [
              {
                data: data.calories,
                color: (opacity = 1) => COLORS.primary,
                strokeWidth: 2,
              },
            ],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Macros Breakdown</Text>
        <BarChart
          data={{
            labels: data.labels,
            datasets: [
              {
                data: data.protein,
              },
            ],
          }}
          width={screenWidth - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix="g"
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
          }}
          style={styles.chart}
        />
      </View>

      <View style={styles.summary}>
        <Text style={styles.sectionTitle}>7-Day Totals</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalCalories.toFixed(0)}</Text>
            <Text style={styles.summaryLabel}>Calories</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalProtein.toFixed(0)}g</Text>
            <Text style={styles.summaryLabel}>Protein</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalCarbs.toFixed(0)}g</Text>
            <Text style={styles.summaryLabel}>Carbs</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalFat.toFixed(0)}g</Text>
            <Text style={styles.summaryLabel}>Fat</Text>
          </View>
        </View>
      </View>

      {goal && (
        <View style={styles.goalCard}>
          <Text style={styles.sectionTitle}>Goal Progress</Text>
          <View style={styles.goalInfo}>
            <Text style={styles.goalText}>
              Target: {goal.targetWeight} kg
            </Text>
            <Text style={styles.goalText}>
              Started: {new Date(goal.startDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      )}

      {foodEntries.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No food entries yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Start scanning your meals to see progress graphs
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
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
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  summary: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  goalCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalInfo: {
    gap: 8,
  },
  goalText: {
    fontSize: 16,
    color: COLORS.text,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    margin: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});


