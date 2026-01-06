import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../utils/constants';

type PhotoAnalysisScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PhotoAnalysis'>;
};

export default function PhotoAnalysisScreen({ navigation }: PhotoAnalysisScreenProps) {
  const [image, setImage] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your photos to analyze progress');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      // Simulate AI analysis (UI only as per specification)
      setTimeout(() => {
        setAnalysisComplete(true);
      }, 2000);
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your camera to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      // Simulate AI analysis (UI only as per specification)
      setTimeout(() => {
        setAnalysisComplete(true);
      }, 2000);
    }
  };

  // Mock analysis data (UI only)
  const mockAnalysis = {
    bodyFatPercentage: '18.5%',
    muscleMass: '+2.3 kg',
    progressScore: 85,
    recommendations: [
      'Continue with your current training routine',
      'Increase protein intake to support muscle growth',
      'Maintain consistent hydration',
    ],
    measurements: {
      chest: '98 cm',
      waist: '82 cm',
      hips: '94 cm',
    },
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Photo Progress Analysis</Text>
        <Text style={styles.subtitle}>
          Take or upload a torso photo to analyze your progress
        </Text>
      </View>

      {!image ? (
        <View style={styles.captureSection}>
          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>How to take a good progress photo:</Text>
            <Text style={styles.instructionsText}>• Wear minimal clothing</Text>
            <Text style={styles.instructionsText}>• Use consistent lighting</Text>
            <Text style={styles.instructionsText}>• Stand straight with arms at sides</Text>
            <Text style={styles.instructionsText}>• Take from the front</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={takePicture}>
              <Text style={styles.primaryButtonText}>📷 Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
              <Text style={styles.secondaryButtonText}>📁 Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.analysisSection}>
          <Image source={{ uri: image }} style={styles.photoPreview} />

          {!analysisComplete ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.analyzingText}>Analyzing your photo...</Text>
              <Text style={styles.analyzingSubtext}>
                Using AI to detect body composition changes
              </Text>
            </View>
          ) : (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Progress Report</Text>

              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{mockAnalysis.bodyFatPercentage}</Text>
                  <Text style={styles.metricLabel}>Body Fat %</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{mockAnalysis.muscleMass}</Text>
                  <Text style={styles.metricLabel}>Muscle Mass</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{mockAnalysis.progressScore}</Text>
                  <Text style={styles.metricLabel}>Progress Score</Text>
                </View>
              </View>

              <View style={styles.measurementsSection}>
                <Text style={styles.sectionTitle}>Measurements</Text>
                <View style={styles.measurementsGrid}>
                  <View style={styles.measurementItem}>
                    <Text style={styles.measurementLabel}>Chest</Text>
                    <Text style={styles.measurementValue}>{mockAnalysis.measurements.chest}</Text>
                  </View>
                  <View style={styles.measurementItem}>
                    <Text style={styles.measurementLabel}>Waist</Text>
                    <Text style={styles.measurementValue}>{mockAnalysis.measurements.waist}</Text>
                  </View>
                  <View style={styles.measurementItem}>
                    <Text style={styles.measurementLabel}>Hips</Text>
                    <Text style={styles.measurementValue}>{mockAnalysis.measurements.hips}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.recommendationsSection}>
                <Text style={styles.sectionTitle}>AI Recommendations</Text>
                {mockAnalysis.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={styles.recommendationBullet}>•</Text>
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setImage(null);
                    setAnalysisComplete(false);
                  }}
                >
                  <Text style={styles.buttonText}>Take New Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  captureSection: {
    padding: 24,
  },
  instructions: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  analysisSection: {
    padding: 24,
  },
  photoPreview: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: '#000',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  analyzingText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  analyzingSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  metricCard: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  measurementsSection: {
    marginBottom: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  measurementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  measurementItem: {
    alignItems: 'center',
  },
  measurementLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  recommendationsSection: {
    marginBottom: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  recommendationBullet: {
    fontSize: 16,
    color: COLORS.primary,
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  buttonRow: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

