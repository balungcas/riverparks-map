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
  selectedPlace: string | null;
}

// Exact locations from Google My Maps KML file
export const places: Place[] = [
  // Malls
  {
    name: 'Vista Mall General Trias',
    type: 'mall',
    walkDistance: '5.8 km',
    carDistance: '3.1 km',
    coordinates: [120.9124179, 14.3225442],
  },
  {
    name: 'Imart Shopping Center',
    type: 'mall',
    walkDistance: '2.8 km',
    carDistance: '1.5 km',
    coordinates: [120.8986942, 14.3858642],
  },
  {
    name: 'The District Imus',
    type: 'mall',
    walkDistance: '6.5 km',
    carDistance: '3.5 km',
    coordinates: [120.9394139, 14.3706188],
  },
  {
    name: 'SM Center Imus',
    type: 'mall',
    walkDistance: '7.2 km',
    carDistance: '3.9 km',
    coordinates: [120.9246296, 14.4088854],
  },
  // Hospitals
  {
    name: 'South Imus Specialist Hospital',
    type: 'hospital',
    walkDistance: '6.4 km',
    carDistance: '3.4 km',
    coordinates: [120.9347566, 14.3765538],
  },
  {
    name: 'Ospital ng Imus',
    type: 'hospital',
    walkDistance: '5.2 km',
    carDistance: '2.8 km',
    coordinates: [120.9199721, 14.3936854],
  },
  {
    name: 'Emilio Aguinaldo College Medical Center - Cavite',
    type: 'hospital',
    walkDistance: '7.1 km',
    carDistance: '3.8 km',
    coordinates: [120.9397649, 14.3486372],
  },
  {
    name: 'De la Salle University Medical Center',
    type: 'hospital',
    walkDistance: '7.9 km',
    carDistance: '4.2 km',
    coordinates: [120.9434238, 14.3271716],
  },
  // Churches
  {
    name: 'San Francisco De Malabon Parish',
    type: 'church',
    walkDistance: '1.9 km',
    carDistance: '1.0 km',
    coordinates: [120.8800058, 14.3855046],
  },
  {
    name: 'Immaculate Conception Parish Church',
    type: 'church',
    walkDistance: '6.8 km',
    carDistance: '3.6 km',
    coordinates: [120.9358534, 14.3269432],
  },
  {
    name: 'The Annunciation of the Lord Parish',
    type: 'church',
    walkDistance: '2.8 km',
    carDistance: '1.5 km',
    coordinates: [120.8955918, 14.3624276],
  },
  {
    name: 'The Church of Jesus Christ of Latter-day Saints',
    type: 'church',
    walkDistance: '1.9 km',
    carDistance: '1.0 km',
    coordinates: [120.8819163, 14.3813168],
  },
  // Schools
  {
    name: 'Samuel Christian College of General Trias, Inc.',
    type: 'school',
    walkDistance: '2.0 km',
    carDistance: '1.1 km',
    coordinates: [120.8888265, 14.3800883],
  },
  {
    name: 'Cavite State University - General Trias Campus',
    type: 'school',
    walkDistance: '1.8 km',
    carDistance: '1.0 km',
    coordinates: [120.88049, 14.3850025],
  },
  {
    name: 'The Palmridge School - General Trias',
    type: 'school',
    walkDistance: '3.7 km',
    carDistance: '2.0 km',
    coordinates: [120.9069569, 14.3428749],
  },
  {
    name: 'Gen. Trias Memorial Elementary School',
    type: 'school',
    walkDistance: '1.7 km',
    carDistance: '0.9 km',
    coordinates: [120.8772768, 14.3825654],
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

const PlaceSidebar = ({ onPlaceClick, selectedCategory, onCategoryChange, selectedPlace }: PlaceSidebarProps) => {
  const handlePlaceClick = (placeName: string, coordinates?: [number, number]) => {
    onPlaceClick(placeName, coordinates);
  };

  // Filter places by selected category
  const filteredPlaces = selectedCategory
    ? places.filter((place) => place.type === selectedCategory)
    : places;

  const groupedPlaces = filteredPlaces.reduce((acc, place) => {
    if (!acc[place.type]) acc[place.type] = [];
    acc[place.type].push(place);
    return acc;
  }, {} as Record<string, Place[]>);

  return (
    <div className="h-full flex flex-col bg-nav-background border-r border-nav-foreground/20 shadow-lg">
      <div className="p-6 border-b border-nav-foreground/20 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-nav-foreground">nearby places</h2>
          <p className="text-sm text-nav-foreground/70 mt-1">from yume at riverparks</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer transition-all hover:scale-105 bg-nav-foreground/10 hover:bg-nav-foreground/20 border-nav-foreground/30 text-nav-foreground"
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
                className={cn(
                  "cursor-pointer gap-1 transition-all hover:scale-105",
                  selectedCategory === type 
                    ? "bg-primary hover:bg-primary/90 text-white border-primary shadow-lg shadow-primary/30" 
                    : "bg-nav-foreground/10 hover:bg-nav-foreground/20 border-nav-foreground/30 text-nav-foreground"
                )}
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
              <div className="p-1.5 rounded-lg bg-primary/20">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-nav-foreground">your location</h3>
            </div>
            
            <Card
              className={cn(
                "p-4 cursor-pointer transition-all duration-300 border-2 bg-nav-foreground/5 hover:scale-[1.02]",
                selectedPlace === 'Yume at Riverparks'
                  ? "border-primary bg-primary/20 shadow-xl shadow-primary/30 ring-2 ring-primary/50"
                  : "border-nav-foreground/20 hover:border-nav-foreground/40 hover:bg-nav-foreground/10 hover:shadow-lg"
              )}
              onClick={() => handlePlaceClick('Yume at Riverparks', [120.876, 14.370])}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-nav-foreground">yume at riverparks</h4>
                </div>
                <p className="text-xs text-nav-foreground/70">general trias, cavite</p>
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
                    type === 'hospital' ? "bg-red-500/20" :
                    type === 'school' ? "bg-blue-500/20" :
                    type === 'church' ? "bg-purple-500/20" : "bg-orange-500/20"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      type === 'hospital' ? "text-red-500" :
                      type === 'school' ? "text-blue-500" :
                      type === 'church' ? "text-purple-500" : "text-orange-500"
                    )} />
                  </div>
                  <h3 className="font-semibold text-nav-foreground">{config.label}</h3>
                  <Badge variant="secondary" className="ml-auto bg-nav-foreground/10 text-nav-foreground border-nav-foreground/30">
                    {placesInCategory.length}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {placesInCategory.map((place) => {
                    const isSelected = selectedPlace === place.name;
                    const selectedStyles = type === 'hospital' 
                      ? "border-red-500 bg-red-500/20 shadow-xl shadow-red-500/30 ring-2 ring-red-500/50"
                      : type === 'school'
                      ? "border-blue-500 bg-blue-500/20 shadow-xl shadow-blue-500/30 ring-2 ring-blue-500/50"
                      : type === 'church'
                      ? "border-purple-500 bg-purple-500/20 shadow-xl shadow-purple-500/30 ring-2 ring-purple-500/50"
                      : "border-orange-500 bg-orange-500/20 shadow-xl shadow-orange-500/30 ring-2 ring-orange-500/50";
                    
                    const iconColor = type === 'hospital' 
                      ? "text-red-500"
                      : type === 'school'
                      ? "text-blue-500"
                      : type === 'church'
                      ? "text-purple-500"
                      : "text-orange-500";
                    
                    return (
                      <Card
                        key={place.name}
                        className={cn(
                          "p-4 cursor-pointer transition-all duration-300 border-2 bg-nav-foreground/5 hover:scale-[1.02]",
                          isSelected
                            ? selectedStyles
                            : "border-nav-foreground/20 hover:border-nav-foreground/40 hover:bg-nav-foreground/10 hover:shadow-lg"
                        )}
                        onClick={() => handlePlaceClick(place.name, place.coordinates)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Icon className={cn("w-4 h-4", iconColor)} />
                            <h4 className="font-medium text-nav-foreground leading-tight">
                              {place.name}
                            </h4>
                          </div>

                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-nav-foreground/70">
                              <Navigation className="w-3.5 h-3.5" />
                              <span>{place.walkDistance}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-nav-foreground/70">
                              <Car className="w-3.5 h-3.5" />
                              <span>{place.carDistance}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
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
