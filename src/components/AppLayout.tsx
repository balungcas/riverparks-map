import { useState } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNavbar from '@/components/BottomNavbar';
import TripPlannerSheet from '@/components/TripPlannerSheet';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  title?: string;
  showHeader?: boolean;
}

const AppLayout = ({ 
  children, 
  activeTab, 
  onTabChange,
  title = "Gala AI",
  showHeader = true
}: AppLayoutProps) => {
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && (
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 h-16">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="w-5 h-5" />
            </Button>
            
            <h1 className="text-xl font-oswald font-semibold tracking-wide">
              {title}
            </h1>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>
      )}
      
      <main className="flex-1 pb-24">
        {children}
      </main>
      
      <BottomNavbar 
        activeTab={activeTab}
        onTabChange={onTabChange}
        onAddClick={() => setIsPlannerOpen(true)}
      />
      
      <TripPlannerSheet 
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
      />
    </div>
  );
};

export default AppLayout;
