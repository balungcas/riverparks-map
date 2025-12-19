import { Home, Compass, Plus, Map, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'explore', icon: Compass, label: 'Explore' },
  { id: 'add', icon: Plus, label: 'Add' },
  { id: 'trips', icon: Map, label: 'Trips' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const BottomNavbar = ({ activeTab, onTabChange, onAddClick }: BottomNavbarProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="bg-card/95 backdrop-blur-lg border-t border-border shadow-strong">
        <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
          {navItems.map((item) => {
            const isCenter = item.id === 'add';
            const isActive = activeTab === item.id;
            
            if (isCenter) {
              return (
                <button
                  key={item.id}
                  onClick={onAddClick}
                  className="relative -mt-8 group"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
                    <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
                  </div>
                </button>
              );
            }
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon 
                  className={cn(
                    "w-6 h-6 transition-transform duration-200",
                    isActive && "scale-110"
                  )} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn(
                  "text-xs font-medium",
                  isActive && "font-semibold"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;
