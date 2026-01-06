import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../types';

// Import screens
import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GoalsScreen from '../screens/GoalsScreen';
import CameraScreen from '../screens/CameraScreen';
import ProgressScreen from '../screens/ProgressScreen';
import PhotoAnalysisScreen from '../screens/PhotoAnalysisScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  console.log('Navigation: Initializing navigation');
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen}
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen 
          name="SignIn" 
          component={SignInScreen}
          options={{ title: 'Sign In' }}
        />
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ title: 'Setup Profile' }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Home', headerShown: false }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
        <Stack.Screen 
          name="Goals" 
          component={GoalsScreen}
          options={{ title: 'Set Goal' }}
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen}
          options={{ title: 'Scan Food' }}
        />
        <Stack.Screen 
          name="Progress" 
          component={ProgressScreen}
          options={{ title: 'Progress' }}
        />
        <Stack.Screen 
          name="PhotoAnalysis" 
          component={PhotoAnalysisScreen}
          options={{ title: 'Photo Analysis' }}
        />
        <Stack.Screen 
          name="Subscription" 
          component={SubscriptionScreen}
          options={{ title: 'Subscription' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

