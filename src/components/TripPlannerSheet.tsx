import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, Sparkles, Loader2, X, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TripPlannerSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularDestinations = [
  { name: 'Palawan', emoji: '🏝️' },
  { name: 'Boracay', emoji: '🏖️' },
  { name: 'Cebu', emoji: '🌴' },
  { name: 'Siargao', emoji: '🏄' },
  { name: 'Bohol', emoji: '🦋' },
  { name: 'Batanes', emoji: '⛰️' },
];

const TripPlannerSheet = ({ isOpen, onClose }: TripPlannerSheetProps) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [travelers, setTravelers] = useState('1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDestinations, setShowDestinations] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    onClose();
  };

  const selectDestination = (name: string) => {
    setDestination(name);
    setShowDestinations(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl p-0 overflow-hidden">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 p-6 pb-12">
          <SheetHeader className="text-left">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <SheetTitle className="text-2xl font-oswald text-white">
                    Plan Your Trip
                  </SheetTitle>
                  <p className="text-white/80 text-sm">
                    AI-powered itinerary in seconds
                  </p>
                </div>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </SheetHeader>
        </div>
        
        {/* Form Content */}
        <div className="bg-background rounded-t-3xl -mt-6 p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Quick Destinations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <Label className="text-sm font-medium">Popular Destinations</Label>
            <div className="flex gap-2 flex-wrap">
              {popularDestinations.map((dest) => (
                <motion.button
                  key={dest.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectDestination(dest.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    destination === dest.name
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {dest.emoji} {dest.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Form Fields */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="origin" className="text-sm font-medium">
                Where are you coming from?
              </Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="origin"
                  placeholder="Manila, Cebu, etc."
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-2 focus:border-primary transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-medium">
                Where do you want to go?
              </Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  id="destination"
                  placeholder="Palawan, Boracay, Bohol..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-2 focus:border-primary transition-colors"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium">
                  How long?
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="duration"
                    placeholder="3 days"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-2 focus:border-primary transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="travelers" className="text-sm font-medium">
                  Travelers
                </Label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="travelers"
                    type="number"
                    min="1"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-2 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={handleGenerate}
                disabled={!destination || isGenerating}
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 shadow-glow text-lg font-semibold disabled:opacity-50"
              >
                {isGenerating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate My Itinerary
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
          
          <p className="text-xs text-center text-muted-foreground">
            ✨ Powered by AI • Your perfect Philippine adventure awaits
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TripPlannerSheet;
