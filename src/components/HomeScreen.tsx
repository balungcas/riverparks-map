import { Compass, Plane, ShoppingBag, Building, UtensilsCrossed, MapPin, ArrowRight, Sparkles, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
}

const categories = [
  { id: 'explore', icon: Compass, label: 'Explore', color: 'bg-explore text-explore-foreground' },
  { id: 'travel', icon: Plane, label: 'Travel', color: 'bg-travel text-travel-foreground' },
  { id: 'shop', icon: ShoppingBag, label: 'Shop', color: 'bg-shop text-shop-foreground' },
  { id: 'hotel', icon: Building, label: 'Hotel', color: 'bg-hotel text-hotel-foreground' },
  { id: 'food', icon: UtensilsCrossed, label: 'Food', color: 'bg-food text-food-foreground' },
  { id: 'flights', icon: MapPin, label: 'Flights', color: 'bg-flights text-flights-foreground' },
];

const popularActivities = [
  {
    id: 1,
    title: 'Island Hopping',
    location: 'El Nido, Palawan',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=400&h=300&fit=crop',
    rating: 4.9,
  },
  {
    id: 2,
    title: 'Beach Paradise',
    location: 'Boracay',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    rating: 4.8,
  },
  {
    id: 3,
    title: 'Chocolate Hills',
    location: 'Bohol',
    image: 'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=400&h=300&fit=crop',
    rating: 4.7,
  },
  {
    id: 4,
    title: 'Rice Terraces',
    location: 'Banaue, Ifugao',
    image: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=400&h=300&fit=crop',
    rating: 4.9,
  },
];

const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.user_metadata?.display_name || 'Traveler';

  return (
    <div className="px-4 py-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground">
            {user ? `Welcome back,` : 'Welcome,'}
          </p>
          <h2 className="text-3xl font-oswald font-semibold">
            {user ? displayName : 'Where to next?'}
          </h2>
        </div>
        {!user && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/auth')}
            className="rounded-full"
          >
            <User className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        )}
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-3 gap-3">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onNavigate('explore')}
            className="animate-slide-up group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Card className="border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                  category.color
                )}>
                  <category.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-foreground">{category.label}</span>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* Popular Activities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-oswald font-semibold">Popular Activities</h3>
          <Button variant="ghost" size="sm" className="text-primary">
            See all <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {popularActivities.map((activity, index) => (
            <Card 
              key={activity.id}
              className="min-w-[200px] border-0 shadow-soft overflow-hidden animate-slide-up hover:shadow-medium transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-32">
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-hero" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white font-semibold text-sm">{activity.title}</p>
                  <p className="text-white/80 text-xs">{activity.location}</p>
                </div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <span className="text-xs font-medium">⭐ {activity.rating}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Plan Your Trip CTA */}
      <Card className="border-0 bg-gradient-primary shadow-glow overflow-hidden">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-oswald font-semibold text-primary-foreground">
              Plan Your Trip
            </h3>
            <p className="text-primary-foreground/80 text-sm">
              Let AI create your perfect Philippine adventure
            </p>
            <Button 
              variant="secondary" 
              size="sm"
              className="mt-2 rounded-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-float">
            <Plane className="w-10 h-10 text-primary-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeScreen;
