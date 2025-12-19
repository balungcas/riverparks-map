import { Home, Compass, Plus, Map, User } from 'lucide-react';
import { motion } from 'framer-motion';
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
      <div className="bg-card/80 backdrop-blur-xl border-t border-border/50 shadow-strong">
        <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isCenter = item.id === 'add';
            const isActive = activeTab === item.id;
            
            if (isCenter) {
              return (
                <motion.button
                  key={item.id}
                  onClick={onAddClick}
                  className="relative -mt-8"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 shadow-glow flex items-center justify-center"
                    animate={{ 
                      boxShadow: [
                        "0 4px 24px hsla(250, 85%, 60%, 0.35)",
                        "0 4px 32px hsla(250, 85%, 60%, 0.5)",
                        "0 4px 24px hsla(250, 85%, 60%, 0.35)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Plus className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </motion.div>
                </motion.button>
              );
            }
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <motion.div
                  animate={{ y: isActive ? -2 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <item.icon 
                    className={cn(
                      "w-6 h-6 relative z-10",
                    )} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </motion.div>
                <motion.span 
                  className={cn(
                    "text-xs font-medium relative z-10",
                    isActive && "font-semibold"
                  )}
                  animate={{ opacity: 1 }}
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;
