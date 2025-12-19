import { User, Settings, Heart, MapPin, LogOut, ChevronRight, Bell, HelpCircle, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const ProfileScreen = () => {
  const menuItems = [
    { icon: Heart, label: 'Favorites', badge: '12' },
    { icon: MapPin, label: 'My Places', badge: '5' },
    { icon: Bell, label: 'Notifications' },
    { icon: Shield, label: 'Privacy & Security' },
    { icon: HelpCircle, label: 'Help & Support' },
    { icon: Settings, label: 'Settings' },
  ];

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
            <h2 className="text-xl font-semibold">Traveler</h2>
            <p className="text-sm text-muted-foreground">traveler@gala.ai</p>
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
      <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
        <LogOut className="w-5 h-5 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default ProfileScreen;
