import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';

interface MapViewProps {
  apiKey: string;
  onFeatureClick?: (feature: any) => void;
  highlightedFeature?: string | null;
}

const MapView = ({ apiKey, onFeatureClick, highlightedFeature }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const popup = useRef<maplibregl.Popup | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !apiKey) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
      center: [120.905, 14.385], // General Trias, Cavite
      zoom: 14,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Create popup
    popup.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 10,
    });

    map.current.on('load', async () => {
      if (!map.current) return;

      try {
        // Load GeoJSON data
        const response = await fetch('/data/yume-riverpark.geojson');
        const geojsonData = await response.json();

        // Add source
        map.current.addSource('yume-data', {
          type: 'geojson',
          data: geojsonData,
        });

        // Add polygon layer
        map.current.addLayer({
          id: 'polygons',
          type: 'fill',
          source: 'yume-data',
          filter: ['==', ['geometry-type'], 'Polygon'],
          paint: {
            'fill-color': 'hsl(var(--polygon-main))',
            'fill-opacity': 0.4,
          },
        });

        // Add polygon outline
        map.current.addLayer({
          id: 'polygon-outline',
          type: 'line',
          source: 'yume-data',
          filter: ['==', ['geometry-type'], 'Polygon'],
          paint: {
            'line-color': 'hsl(var(--polygon-main))',
            'line-width': 2,
          },
        });

        // Add LineString layer
        map.current.addLayer({
          id: 'linestrings',
          type: 'line',
          source: 'yume-data',
          filter: ['==', ['geometry-type'], 'LineString'],
          paint: {
            'line-color': 'hsl(var(--line-primary))',
            'line-width': 3,
            'line-opacity': 0.8,
          },
        });

        // Add MultiLineString layer
        map.current.addLayer({
          id: 'multilinestrings',
          type: 'line',
          source: 'yume-data',
          filter: ['==', ['geometry-type'], 'MultiLineString'],
          paint: {
            'line-color': 'hsl(var(--line-secondary))',
            'line-width': 3,
            'line-opacity': 0.8,
          },
        });

        // Find and zoom to polygon
        const yumePolygon = geojsonData.features.find(
          (f: any) => f.geometry.type === 'Polygon' && f.properties.text === 'Yume at Riverparks'
        );

        if (yumePolygon && map.current) {
          const coordinates = yumePolygon.geometry.coordinates[0];
          const bounds = coordinates.reduce(
            (bounds: maplibregl.LngLatBounds, coord: [number, number]) => {
              return bounds.extend(coord as [number, number]);
            },
            new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
          );

          map.current.fitBounds(bounds, {
            padding: 100,
            duration: 2000,
          });
        }

        // Add hover interactions
        const layers = ['polygons', 'linestrings', 'multilinestrings'];
        
        layers.forEach((layer) => {
          map.current!.on('mouseenter', layer, (e) => {
            if (!map.current || !popup.current) return;
            map.current.getCanvas().style.cursor = 'pointer';

            const feature = e.features?.[0];
            if (feature && feature.properties) {
              const name = feature.properties.text || feature.properties.name || 'Unnamed';
              popup.current
                .setLngLat(e.lngLat)
                .setHTML(`<div class="text-sm font-medium">${name}</div>`)
                .addTo(map.current);
            }
          });

          map.current!.on('mouseleave', layer, () => {
            if (!map.current || !popup.current) return;
            map.current.getCanvas().style.cursor = '';
            popup.current.remove();
          });

          map.current!.on('click', layer, (e) => {
            const feature = e.features?.[0];
            if (feature && onFeatureClick) {
              onFeatureClick(feature);
            }
          });
        });

        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    });

    return () => {
      if (popup.current) popup.current.remove();
      if (map.current) map.current.remove();
    };
  }, [apiKey]);

  // Handle highlighted feature
  useEffect(() => {
    if (!map.current || !isLoaded || !highlightedFeature) return;

    const source = map.current.getSource('yume-data') as maplibregl.GeoJSONSource;
    if (!source) return;

    // Find the feature and zoom to it
    fetch('/data/yume-riverpark.geojson')
      .then((res) => res.json())
      .then((data) => {
        const feature = data.features.find(
          (f: any) => f.properties.text === highlightedFeature || f.properties.name === highlightedFeature
        );

        if (feature && map.current) {
          // Calculate bounds
          let bounds = new maplibregl.LngLatBounds();
          
          if (feature.geometry.type === 'Point') {
            const coords = feature.geometry.coordinates;
            map.current.flyTo({
              center: coords,
              zoom: 16,
              duration: 1500,
            });
          } else if (feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates[0].forEach((coord: [number, number]) => {
              bounds.extend(coord);
            });
            map.current.fitBounds(bounds, {
              padding: 100,
              duration: 1500,
            });
          } else if (feature.geometry.type === 'LineString') {
            feature.geometry.coordinates.forEach((coord: [number, number]) => {
              bounds.extend(coord);
            });
            map.current.fitBounds(bounds, {
              padding: 100,
              duration: 1500,
            });
          }
        }
      });
  }, [highlightedFeature, isLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className={cn("absolute inset-0", !apiKey && "blur-sm")} />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
