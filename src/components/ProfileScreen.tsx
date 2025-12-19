import { useNavigate } from 'react-router-dom';
import { User, Settings, Heart, MapPin, LogOut, ChevronRight, Bell, HelpCircle, Shield, LogIn } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
    { icon: Heart, label: 'Favorites', badge: '0' },
    { icon: MapPin, label: 'My Places', badge: '0' },
    { icon: Bell, label: 'Notifications' },
    { icon: Shield, label: 'Privacy & Security' },
    { icon: HelpCircle, label: 'Help & Support' },
    { icon: Settings, label: 'Settings' },
  ];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-32 h-32 mb-6 bg-secondary rounded-full flex items-center justify-center">
          <User className="w-16 h-16 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-oswald font-semibold mb-2">Sign in to continue</h2>
        <p className="text-muted-foreground mb-6 max-w-xs">
          Create an account to save your trips, favorites, and personalize your experience
        </p>
        <Button 
          onClick={() => navigate('/auth')}
          className="rounded-xl bg-gradient-primary shadow-glow px-8"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Sign In / Sign Up
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-soft overflow-hidden">
        <div className="h-24 bg-gradient-primary" />
        <CardContent className="relative pt-12 pb-6">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
            <div className="w-20 h-20 rounded-full bg-card border-4 border-card flex items-center justify-center shadow-medium">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {user.user_metadata?.display_name || 'Traveler'}
            </h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Button variant="outline" size="sm" className="mt-3 rounded-full">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Trips', value: '0' },
          { label: 'Places', value: '0' },
          { label: 'Reviews', value: '0' },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-soft">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-oswald font-semibold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Menu Items */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-2">
          {menuItems.map((item, index) => (
            <div key={item.label}>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="flex-1 text-left font-medium">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              {index < menuItems.length - 1 && <Separator className="my-1" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Logout */}
      <Button 
        variant="ghost" 
        onClick={handleSignOut}
        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default ProfileScreen;
