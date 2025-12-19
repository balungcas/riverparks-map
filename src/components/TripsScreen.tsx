import { MapPin, Calendar, Plane } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TripsScreen = () => {
  const savedTrips: any[] = []; // Empty for now

  if (savedTrips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-32 h-32 mb-6 bg-secondary rounded-full flex items-center justify-center animate-float">
          <Plane className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-2xl font-oswald font-semibold mb-2">No trips yet</h2>
        <p className="text-muted-foreground mb-6 max-w-xs">
          Start planning your Philippine adventure and save your favorite itineraries here
        </p>
        <Button className="rounded-xl bg-gradient-primary shadow-glow px-8">
          Plan Your First Trip
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-oswald font-semibold">Your Trips</h2>
        <p className="text-muted-foreground">Your saved travel itineraries</p>
      </div>

      <div className="space-y-4">
        {savedTrips.map((trip) => (
          <Card key={trip.id} className="border-0 shadow-soft">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-secondary" />
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
        ))}
      </div>
    </div>
  );
};

export default TripsScreen;
