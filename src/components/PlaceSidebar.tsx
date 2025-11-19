import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Building2, GraduationCap, Church, ShoppingBag, Navigation, Car, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Place {
  name: string;
  type: 'hospital' | 'school' | 'church' | 'mall';
  walkDistance: string;
  carDistance: string;
  coordinates: [number, number];
}

interface PlaceSidebarProps {
  onPlaceClick: (placeName: string, coordinates?: [number, number]) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

// Sample places data with accurate coordinates from Google Maps
export const places: Place[] = [
  // Hospitals
  {
    name: 'General Trias District Hospital',
    type: 'hospital',
    walkDistance: '2.5 km',
    carDistance: '1.2 km',
    coordinates: [120.881989, 14.373900],
  },
  {
    name: 'St. Dominic Medical Center',
    type: 'hospital',
    walkDistance: '3.2 km',
    carDistance: '1.8 km',
    coordinates: [120.884500, 14.378200],
  },
  // Schools
  {
    name: 'General Trias Technical High School',
    type: 'school',
    walkDistance: '1.8 km',
    carDistance: '0.9 km',
    coordinates: [120.876800, 14.382500],
  },
  {
    name: 'Saint John Academy',
    type: 'school',
    walkDistance: '2.1 km',
    carDistance: '1.1 km',
    coordinates: [120.883200, 14.387100],
  },
  {
    name: 'Lyceum of the Philippines University',
    type: 'school',
    walkDistance: '3.5 km',
    carDistance: '2.0 km',
    coordinates: [120.891500, 14.392800],
  },
  // Churches
  {
    name: 'San Francisco de Malabon Parish',
    type: 'church',
    walkDistance: '2.0 km',
    carDistance: '1.0 km',
    coordinates: [120.880000, 14.385500],
  },
  {
    name: 'Victory Church General Trias',
    type: 'church',
    walkDistance: '2.8 km',
    carDistance: '1.5 km',
    coordinates: [120.888500, 14.389200],
  },
  // Malls
  {
    name: 'Vista Mall General Trias',
    type: 'mall',
    walkDistance: '2.3 km',
    carDistance: '1.3 km',
    coordinates: [120.886200, 14.380700],
  },
  {
    name: 'Paseo de Sta. Rosa',
    type: 'mall',
    walkDistance: '4.5 km',
    carDistance: '2.5 km',
    coordinates: [121.088893, 14.284302],
  },
];

const categoryConfig = {
  hospital: {
    icon: Building2,
    label: 'Hospitals',
    color: 'hospital',
  },
  school: {
    icon: GraduationCap,
    label: 'Schools',
    color: 'school',
  },
  church: {
    icon: Church,
    label: 'Churches',
    color: 'church',
  },
  mall: {
    icon: ShoppingBag,
    label: 'Malls',
    color: 'mall',
  },
};

const PlaceSidebar = ({ onPlaceClick, selectedCategory, onCategoryChange }: PlaceSidebarProps) => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const handlePlaceClick = (placeName: string, coordinates?: [number, number]) => {
    setSelectedPlace(placeName);
    onPlaceClick(placeName, coordinates);
  };

  const groupedPlaces = places.reduce((acc, place) => {
    if (!acc[place.type]) acc[place.type] = [];
    acc[place.type].push(place);
    return acc;
  }, {} as Record<string, Place[]>);

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <div className="p-6 border-b border-border space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Nearby Places</h2>
          <p className="text-sm text-muted-foreground mt-1">From Yume at Riverparks</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onCategoryChange(null)}
          >
            All
          </Badge>
          {Object.entries(categoryConfig).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <Badge
                key={type}
                variant={selectedCategory === type ? "default" : "outline"}
                className="cursor-pointer gap-1"
                onClick={() => onCategoryChange(type)}
              >
                <Icon className="w-3 h-3" />
                {config.label}
              </Badge>
            );
          })}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Yume at Riverparks Card */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Your Location</h3>
            </div>
            
            <Card
              className={cn(
                "p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                selectedPlace === 'Yume at Riverparks'
                  ? "border-primary bg-primary/5"
                  : "border-transparent hover:border-border"
              )}
              onClick={() => handlePlaceClick('Yume at Riverparks', [120.905, 14.385])}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-foreground">Yume at Riverparks</h4>
                </div>
                <p className="text-xs text-muted-foreground">General Trias, Cavite</p>
              </div>
            </Card>
          </div>
          {Object.entries(groupedPlaces).map(([type, placesInCategory]) => {
            const config = categoryConfig[type as keyof typeof categoryConfig];
            const Icon = config.icon;

            return (
              <div key={type} className="space-y-3">
                <div className="flex items-center gap-2 px-2">
                  <div className={cn(
                    "p-1.5 rounded-lg",
                    `bg-${config.color}/10`
                  )}>
                    <Icon className={cn("w-4 h-4", `text-${config.color}`)} />
                  </div>
                  <h3 className="font-semibold text-foreground">{config.label}</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {placesInCategory.length}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {placesInCategory.map((place) => (
                    <Card
                      key={place.name}
                      className={cn(
                        "p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                        selectedPlace === place.name
                          ? `border-${config.color} bg-${config.color}/5`
                          : "border-transparent hover:border-border"
                      )}
                      onClick={() => handlePlaceClick(place.name, place.coordinates)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("w-4 h-4", `text-${config.color}`)} />
                          <h4 className="font-medium text-foreground leading-tight">
                            {place.name}
                          </h4>
                        </div>

                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Navigation className="w-3.5 h-3.5" />
                            <span>{place.walkDistance}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Car className="w-3.5 h-3.5" />
                            <span>{place.carDistance}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlaceSidebar;
