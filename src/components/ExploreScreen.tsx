import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ExploreScreenProps {
  apiKey: string;
}

const hotPlaces = [
  { id: 1, name: 'Palawan', emoji: '🏝️' },
  { id: 2, name: 'Boracay', emoji: '🏖️' },
  { id: 3, name: 'Cebu', emoji: '🌴' },
  { id: 4, name: 'Siargao', emoji: '🏄' },
  { id: 5, name: 'Bohol', emoji: '🦎' },
];

const ExploreScreen = ({ apiKey }: ExploreScreenProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!mapContainer.current || !apiKey) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
      center: [121.7740, 12.8797], // Center of Philippines
      zoom: 5.5,
      pitch: 30,
    });

    map.current.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      'bottom-right'
    );

    map.current.on('load', () => {
      setIsMapLoaded(true);
      
      // Add markers for popular destinations
      const destinations = [
        { name: 'El Nido', coords: [119.3958, 11.1817] as [number, number] },
        { name: 'Boracay', coords: [121.9218, 11.9674] as [number, number] },
        { name: 'Cebu', coords: [123.8854, 10.3157] as [number, number] },
        { name: 'Siargao', coords: [126.1185, 9.8488] as [number, number] },
        { name: 'Bohol', coords: [124.0000, 9.8500] as [number, number] },
      ];

      destinations.forEach((dest) => {
        const el = document.createElement('div');
        el.className = 'flex items-center justify-center w-10 h-10 bg-primary rounded-full shadow-lg cursor-pointer transform hover:scale-110 transition-transform';
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

        new maplibregl.Marker({ element: el })
          .setLngLat(dest.coords)
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 8px;">
                <h3 style="font-weight: 600; margin-bottom: 4px;">${dest.name}</h3>
                <p style="font-size: 12px; color: #666;">Tap to explore</p>
              </div>
            `)
          )
          .addTo(map.current!);
      });
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, [apiKey]);

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Overlay UI */}
      <div className="absolute inset-x-0 top-0 p-4 space-y-4 pointer-events-none">
        {/* Search Bar */}
        <div className="pointer-events-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-14 rounded-2xl bg-card/95 backdrop-blur-lg shadow-medium border-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Hot Places Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 pointer-events-auto scrollbar-hide">
          {hotPlaces.map((place) => (
            <button
              key={place.id}
              onClick={() => {
                // Fly to location
                const coords: Record<string, [number, number]> = {
                  'Palawan': [118.7354, 9.8349],
                  'Boracay': [121.9218, 11.9674],
                  'Cebu': [123.8854, 10.3157],
                  'Siargao': [126.1185, 9.8488],
                  'Bohol': [124.0000, 9.8500],
                };
                if (map.current && coords[place.name]) {
                  map.current.flyTo({
                    center: coords[place.name],
                    zoom: 10,
                    duration: 2000,
                  });
                }
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full bg-card/95 backdrop-blur-lg shadow-soft",
                "hover:bg-primary hover:text-primary-foreground transition-colors duration-200",
                "whitespace-nowrap text-sm font-medium"
              )}
            >
              <span>{place.emoji}</span>
              <span>{place.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Card */}
      <div className="absolute inset-x-0 bottom-24 px-4 pointer-events-auto">
        <Card className="border-0 shadow-strong bg-card/95 backdrop-blur-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Discover Philippines</h3>
                <p className="text-sm text-muted-foreground">7,641 islands to explore</p>
              </div>
              <Button className="rounded-xl bg-gradient-primary shadow-glow">
                Explore
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreScreen;
