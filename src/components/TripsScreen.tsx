import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Plane, LogIn, Plus, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

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

const TripsScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const savedTrips: any[] = [];

  if (!user) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div 
          className="w-32 h-32 mb-6 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Plane className="w-16 h-16 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-oswald font-semibold mb-2">Sign in to save trips</h2>
        <p className="text-muted-foreground mb-6 max-w-xs">
          Create an account to save your travel itineraries and access them anywhere
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

  if (savedTrips.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants}
          className="w-40 h-40 mb-6 relative"
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute inset-4 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-full flex items-center justify-center"
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Plane className="w-16 h-16 text-primary" />
          </motion.div>
        </motion.div>
        
        <motion.h2 variants={itemVariants} className="text-2xl font-oswald font-semibold mb-2">
          No trips yet
        </motion.h2>
        <motion.p variants={itemVariants} className="text-muted-foreground mb-8 max-w-xs">
          Start planning your Philippine adventure and save your favorite itineraries here
        </motion.p>
        
        <motion.div variants={itemVariants} className="space-y-3 w-full max-w-xs">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full rounded-xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 shadow-glow h-14 text-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Plan Your First Trip
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" className="w-full rounded-xl h-12">
              <Plus className="w-5 h-5 mr-2" />
              Create Manual Trip
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="px-4 py-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-oswald font-semibold">Your Trips</h2>
          <p className="text-muted-foreground">Your saved travel itineraries</p>
        </div>
        <Button size="icon" className="rounded-full bg-primary shadow-md">
          <Plus className="w-5 h-5" />
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        {savedTrips.map((trip) => (
          <motion.div
            key={trip.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="border-0 shadow-soft overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{trip.destination}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{trip.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{trip.origin}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default TripsScreen;
