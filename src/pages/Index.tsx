import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import HomeScreen from '@/components/HomeScreen';
import ExploreScreen from '@/components/ExploreScreen';
import TripsScreen from '@/components/TripsScreen';
import ProfileScreen from '@/components/ProfileScreen';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const apiKey = 'TzNncyeb8gVUMH68QKMX'; // MapTiler API key

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
