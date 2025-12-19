import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Heart, MapPin, LogOut, ChevronRight, Bell, HelpCircle, Shield, LogIn, Camera, Edit2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
  };

  const menuItems = [
    { icon: Heart, label: 'Favorites', badge: '0', color: 'text-pink-500' },
    { icon: MapPin, label: 'My Places', badge: '0', color: 'text-blue-500' },
    { icon: Bell, label: 'Notifications', color: 'text-amber-500' },
    { icon: Shield, label: 'Privacy & Security', color: 'text-green-500' },
    { icon: HelpCircle, label: 'Help & Support', color: 'text-purple-500' },
    { icon: Settings, label: 'Settings', color: 'text-gray-500' },
  ];

  if (!user) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div 
          className="w-32 h-32 mb-6 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <User className="w-16 h-16 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-oswald font-semibold mb-2">Sign in to continue</h2>
        <p className="text-muted-foreground mb-6 max-w-xs">
          Create an account to save your trips, favorites, and personalize your experience
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={() => navigate('/auth')}
            className="rounded-xl bg-gradient-to-r from-primary to-purple-600 shadow-glow px-8 h-12"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In / Sign Up
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  const displayName = user.user_metadata?.display_name || 'Traveler';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <motion.div 
      className="px-4 py-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Profile Header */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-soft overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-primary via-purple-500 to-pink-500 relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <CardContent className="relative pt-14 pb-6">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 border-4 border-card flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">{initials}</span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-card shadow-md flex items-center justify-center border-2 border-background hover:bg-primary hover:text-white transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" className="mt-3 rounded-full">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Trips', value: '0', icon: '✈️' },
          { label: 'Places', value: '0', icon: '📍' },
          { label: 'Reviews', value: '0', icon: '⭐' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="border-0 shadow-soft cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-2xl font-oswald font-semibold text-primary mt-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Menu Items */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-soft overflow-hidden">
          <CardContent className="p-2">
            {menuItems.map((item, index) => (
              <motion.div key={item.label}>
                <motion.button 
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </motion.button>
                {index < menuItems.length - 1 && <Separator className="my-1 mx-3" />}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Logout */}
      <motion.div variants={itemVariants}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileScreen;
