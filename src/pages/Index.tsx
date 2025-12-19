import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import HomeScreen from '@/components/HomeScreen';
import ExploreScreen from '@/components/ExploreScreen';
import TripsScreen from '@/components/TripsScreen';
import ProfileScreen from '@/components/ProfileScreen';
import OnboardingScreen from '@/components/OnboardingScreen';

const ONBOARDING_KEY = 'gala-ai-onboarding-completed';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const apiKey = 'TzNncyeb8gVUMH68QKMX'; // MapTiler API key

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompleted = localStorage.getItem(ONBOARDING_KEY);
    if (!hasCompleted) {
      setShowOnboarding(true);
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={setActiveTab} />;
      case 'explore':
        return <ExploreScreen apiKey={apiKey} />;
      case 'trips':
        return <TripsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onNavigate={setActiveTab} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <AppLayout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      showHeader={activeTab !== 'explore'}
    >
      {renderScreen()}
    </AppLayout>
  );
};

export default Index;
