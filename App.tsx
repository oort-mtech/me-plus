import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import Navigation from './src/navigation/index';
import { ErrorBoundary } from './src/components/ErrorBoundary';

export default function App() {
  useEffect(() => {
    console.log('App.tsx: App component mounted');
  }, []);

  console.log('App.tsx: Rendering App component');
  
  return (
    <ErrorBoundary>
      <Navigation />
      <StatusBar style="auto" />
    </ErrorBoundary>
  );
}
