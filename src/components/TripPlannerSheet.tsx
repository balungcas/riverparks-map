import { useState } from 'react';
import { MapPin, Calendar, Users, Sparkles, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TripPlannerSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const TripPlannerSheet = ({ isOpen, onClose }: TripPlannerSheetProps) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [travelers, setTravelers] = useState('1');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="text-left pb-6">
          <SheetTitle className="text-2xl font-oswald flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Plan Your Adventure
          </SheetTitle>
          <p className="text-muted-foreground text-sm">
            Let AI create your perfect Philippine itinerary
          </p>
        </SheetHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="origin" className="text-sm font-medium">
              Where are you coming from?
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="origin"
                placeholder="Manila, Cebu, etc."
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-medium">
              Where do you want to go?
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <Input
                id="destination"
                placeholder="Palawan, Boracay, Bohol..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Duration
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="duration"
                  placeholder="3 days"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="travelers" className="text-sm font-medium">
                Travelers
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleGenerate}
            disabled={!destination || isGenerating}
            className="w-full h-14 rounded-xl bg-gradient-primary shadow-glow text-lg font-semibold"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Itinerary
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Powered by Gemini AI • Discover the best of the Philippines
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TripPlannerSheet;
