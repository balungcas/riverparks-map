import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, X, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ExploreScreenProps {
  apiKey: string;
}

const hotPlaces = [
  { id: 1, name: 'Palawan', emoji: '🏝️', coords: [118.7354, 9.8349] as [number, number] },
  { id: 2, name: 'Boracay', emoji: '🏖️', coords: [121.9218, 11.9674] as [number, number] },
  { id: 3, name: 'Cebu', emoji: '🌴', coords: [123.8854, 10.3157] as [number, number] },
  { id: 4, name: 'Siargao', emoji: '🏄', coords: [126.1185, 9.8488] as [number, number] },
  { id: 5, name: 'Bohol', emoji: '🦋', coords: [124.0000, 9.8500] as [number, number] },
];

const destinations = [
  { name: 'El Nido', coords: [119.3958, 11.1817] as [number, number], image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=200&h=150&fit=crop' },
  { name: 'Boracay', coords: [121.9218, 11.9674] as [number, number], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=150&fit=crop' },
  { name: 'Cebu', coords: [123.8854, 10.3157] as [number, number], image: 'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=200&h=150&fit=crop' },
  { name: 'Siargao', coords: [126.1185, 9.8488] as [number, number], image: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=200&h=150&fit=crop' },
  { name: 'Bohol', coords: [124.0000, 9.8500] as [number, number], image: 'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=200&h=150&fit=crop' },
];

const ExploreScreen = ({ apiKey }: ExploreScreenProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !apiKey) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
      center: [121.7740, 12.8797],
      zoom: 5.5,
      pitch: 40,
    });

    map.current.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      'bottom-right'
    );

    map.current.on('load', () => {
      setIsMapLoaded(true);
      
      destinations.forEach((dest) => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = `
          <div class="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform border-3 border-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(250, 85%, 60%)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `;

        new maplibregl.Marker({ element: el })
          .setLngLat(dest.coords)
          .setPopup(
            new maplibregl.Popup({ offset: 25, className: 'custom-popup' }).setHTML(`
              <div style="padding: 12px; min-width: 150px;">
                <img src="${dest.image}" alt="${dest.name}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
                <h3 style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${dest.name}</h3>
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

  const flyToPlace = (coords: [number, number], name: string) => {
    setSelectedPlace(name);
    if (map.current) {
      map.current.flyTo({
        center: coords,
        zoom: 10,
        duration: 2000,
        pitch: 50,
      });
    }
  };

  const resetView = () => {
    setSelectedPlace(null);
    if (map.current) {
      map.current.flyTo({
        center: [121.7740, 12.8797],
        zoom: 5.5,
        duration: 1500,
        pitch: 40,
      });
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Overlay UI */}
      <div className="absolute inset-x-0 top-0 p-4 space-y-3 pointer-events-none">
        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
              className="pl-12 pr-12 h-14 rounded-2xl bg-card/95 backdrop-blur-xl shadow-lg border-0 text-base"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl hover:bg-primary/10"
            >
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Hot Places Pills */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2 pointer-events-auto scrollbar-hide"
        >
          {hotPlaces.map((place, index) => (
            <motion.button
              key={place.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => flyToPlace(place.coords, place.name)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-xl shadow-md",
                "whitespace-nowrap text-sm font-medium transition-all duration-300",
                selectedPlace === place.name
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/95 hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <span className="text-lg">{place.emoji}</span>
              <span>{place.name}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Selected Place Indicator */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-36 left-4 right-4 pointer-events-auto"
          >
            <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-xl">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedPlace}</p>
                    <p className="text-xs text-muted-foreground">Exploring area</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetView}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Card */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute inset-x-0 bottom-24 px-4 pointer-events-auto"
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card className="border-0 shadow-xl bg-card/95 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Discover Philippines</h3>
                  <p className="text-sm text-muted-foreground">7,641 islands to explore</p>
                </div>
                <Button className="rounded-xl bg-gradient-to-r from-primary to-purple-600 shadow-lg px-6">
                  Explore
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {!isMapLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-background"
          >
            <div className="text-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"
              />
              <p className="text-muted-foreground font-medium">Loading your adventure...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreScreen;
