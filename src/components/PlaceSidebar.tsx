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

const PlaceSidebar = ({ onPlaceClick, selectedCategory, onCategoryChange }: PlaceSidebarProps) => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const handlePlaceClick = (placeName: string, coordinates?: [number, number]) => {
    setSelectedPlace(placeName);
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
    <div className="h-full flex flex-col bg-black/30 backdrop-blur-xl border-r border-white/20 shadow-2xl">
      <div className="p-6 border-b border-white/20 space-y-4 bg-gradient-to-b from-white/5 to-transparent">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Nearby Places</h2>
          <p className="text-sm text-white/80 mt-1">From Yume at Riverparks</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer transition-all hover:scale-105 bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm"
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
                  "cursor-pointer gap-1 transition-all hover:scale-105 backdrop-blur-sm",
                  selectedCategory === type 
                    ? "bg-primary hover:bg-primary/90 text-white border-primary shadow-lg shadow-primary/30" 
                    : "bg-white/10 hover:bg-white/20 border-white/30 text-white"
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
              <div className="p-1.5 rounded-lg bg-primary/20 backdrop-blur-sm">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-white">Your Location</h3>
            </div>
            
            <Card
              className={cn(
                "p-4 cursor-pointer transition-all duration-300 border-2 bg-white/10 backdrop-blur-md hover:scale-[1.02]",
                selectedPlace === 'Yume at Riverparks'
                  ? "border-primary bg-primary/30 shadow-xl shadow-primary/30 ring-2 ring-primary/50"
                  : "border-white/20 hover:border-white/40 hover:bg-white/15 hover:shadow-lg"
              )}
              onClick={() => handlePlaceClick('Yume at Riverparks', [120.876, 14.370])}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-primary drop-shadow-lg" />
                  <h4 className="font-semibold text-white drop-shadow-md">Yume at Riverparks</h4>
                </div>
                <p className="text-xs text-white/70">General Trias, Cavite</p>
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
                    "p-1.5 rounded-lg backdrop-blur-md shadow-lg",
                    `bg-${config.color}/30`
                  )}>
                    <Icon className={cn("w-4 h-4 drop-shadow-lg", `text-${config.color}`)} />
                  </div>
                  <h3 className="font-semibold text-white drop-shadow-md">{config.label}</h3>
                  <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30 backdrop-blur-sm shadow-md">
                    {placesInCategory.length}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {placesInCategory.map((place) => (
                    <Card
                      key={place.name}
                      className={cn(
                        "p-4 cursor-pointer transition-all duration-300 border-2 bg-white/10 backdrop-blur-md hover:scale-[1.02]",
                        selectedPlace === place.name
                          ? `border-${config.color} bg-${config.color}/30 shadow-xl shadow-${config.color}/30 ring-2 ring-${config.color}/50`
                          : "border-white/20 hover:border-white/40 hover:bg-white/15 hover:shadow-lg"
                      )}
                      onClick={() => handlePlaceClick(place.name, place.coordinates)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("w-4 h-4 drop-shadow-lg", `text-${config.color}`)} />
                          <h4 className="font-medium text-white leading-tight drop-shadow-md">
                            {place.name}
                          </h4>
                        </div>

                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-white/80">
                            <Navigation className="w-3.5 h-3.5" />
                            <span>{place.walkDistance}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/80">
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
