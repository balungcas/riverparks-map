import { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Plane, ShoppingBag, Building, UtensilsCrossed, MapPin, ArrowRight, Sparkles, User, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
}

const categories = [
  { id: 'explore', icon: Compass, label: 'Explore', color: 'bg-explore', gradient: 'from-orange-400 to-orange-600' },
  { id: 'travel', icon: Plane, label: 'Travel', color: 'bg-travel', gradient: 'from-purple-400 to-purple-600' },
  { id: 'shop', icon: ShoppingBag, label: 'Shop', color: 'bg-shop', gradient: 'from-pink-400 to-pink-600' },
  { id: 'hotel', icon: Building, label: 'Hotel', color: 'bg-hotel', gradient: 'from-teal-400 to-teal-600' },
  { id: 'food', icon: UtensilsCrossed, label: 'Food', color: 'bg-food', gradient: 'from-amber-400 to-amber-600' },
  { id: 'flights', icon: MapPin, label: 'Places', color: 'bg-flights', gradient: 'from-blue-400 to-blue-600' },
];

const popularActivities = [
  {
    id: 1,
    title: 'Island Hopping',
    location: 'El Nido, Palawan',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=400&h=300&fit=crop',
    rating: 4.9,
    price: '₱2,500',
  },
  {
    id: 2,
    title: 'Beach Paradise',
    location: 'Boracay',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    rating: 4.8,
    price: '₱1,800',
  },
  {
    id: 3,
    title: 'Chocolate Hills',
    location: 'Bohol',
    image: 'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=400&h=300&fit=crop',
    rating: 4.7,
    price: '₱1,200',
  },
  {
    id: 4,
    title: 'Rice Terraces',
    location: 'Banaue, Ifugao',
    image: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=400&h=300&fit=crop',
    rating: 4.9,
    price: '₱3,000',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.user_metadata?.display_name?.split(' ')[0] || 'Traveler';
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <motion.div 
      className="px-4 py-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <h2 className="text-3xl font-oswald font-semibold">
            Hello, {displayName}! 👋
          </h2>
          <p className="text-muted-foreground">Ready for your next adventure?</p>
        </div>
        {!user ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/auth')}
              className="rounded-full border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold cursor-pointer shadow-lg"
            onClick={() => onNavigate('profile')}
          >
            {displayName.charAt(0).toUpperCase()}
          </motion.div>
        )}
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={itemVariants}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('explore')}
          className="w-full p-4 rounded-2xl bg-card shadow-soft border border-border/50 flex items-center gap-3 text-left hover:shadow-medium transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Where do you want to go?</p>
            <p className="text-sm text-muted-foreground">Destinations, hotels, activities...</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </motion.button>
      </motion.div>

      {/* Category Grid */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Categories</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('explore')}
              onHoverStart={() => setHoveredCategory(category.id)}
              onHoverEnd={() => setHoveredCategory(null)}
              className="group"
            >
              <Card className={cn(
                "border-0 shadow-soft overflow-hidden transition-all duration-300",
                hoveredCategory === category.id && "shadow-lg"
              )}>
                <CardContent className="p-4 flex flex-col items-center gap-3">
                  <motion.div 
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-md",
                      category.gradient
                    )}
                    animate={{ 
                      rotate: hoveredCategory === category.id ? [0, -10, 10, 0] : 0 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <category.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <span className="text-sm font-medium text-foreground">{category.label}</span>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Popular Activities */}
      <motion.section variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Popular Activities</h3>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            See all <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
          {popularActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="snap-start"
            >
              <Card className="min-w-[220px] border-0 shadow-soft overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300">
                <div className="relative h-36">
                  <img 
                    src={activity.image} 
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-semibold">{activity.title}</p>
                    <div className="flex items-center gap-1 text-white/80 text-sm">
                      <MapPin className="w-3 h-3" />
                      <span>{activity.location}</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-semibold">{activity.rating}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Starting from</span>
                    <span className="font-semibold text-primary">{activity.price}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Plan Your Trip CTA */}
      <motion.div variants={itemVariants}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="border-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 shadow-glow overflow-hidden cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex-1 space-y-3">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">AI Powered</span>
                </div>
                <h3 className="text-2xl font-oswald font-semibold text-white">
                  Plan Your Trip
                </h3>
                <p className="text-white/80 text-sm">
                  Get a personalized itinerary in seconds
                </p>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </div>
              <motion.div 
                className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Plane className="w-12 h-12 text-white" />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Bottom spacing for nav */}
      <div className="h-4" />
    </motion.div>
  );
};

export default HomeScreen;
