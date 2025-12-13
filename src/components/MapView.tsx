import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';
import { Place } from './PlaceSidebar';
import { Building2, GraduationCap, Church, ShoppingBag } from 'lucide-react';
import { createRoot } from 'react-dom/client';

interface MapViewProps {
  apiKey: string;
  onFeatureClick?: (feature: any) => void;
  highlightedFeature?: string | null;
  highlightedCoordinates?: [number, number] | null;
  places: Place[];
  selectedCategory: string | null;
  selectedPlace?: string | null;
  onMarkerClick?: (placeName: string, coordinates: [number, number]) => void;
}

// Icon colors for each category
const categoryColors = {
  hospital: '#e74c3c',
  school: '#3498db',
  church: '#9b59b6',
  mall: '#e67e22',
};

const categoryIcons = {
  hospital: Building2,
  school: GraduationCap,
  church: Church,
  mall: ShoppingBag,
};

// Convert EPSG:3857 (Web Mercator) to WGS84 (lng, lat)
const webMercatorToWGS84 = (x: number, y: number): [number, number] => {
  const lng = (x / 20037508.34) * 180;
  const lat = (Math.atan(Math.exp((y / 20037508.34) * Math.PI)) * 360) / Math.PI - 90;
  return [lng, lat];
};

// Image bounds corrected - MapLibre expects: topLeft, topRight, bottomRight, bottomLeft
const getImageBounds = (): [[number, number], [number, number], [number, number], [number, number]] => {
  // Corrected orientation based on user coordinates
  const topLeft: [number, number] = [120.905747, 14.379416];     // NW corner
  const topRight: [number, number] = [120.910025, 14.381254];    // NE corner  
  const bottomRight: [number, number] = [120.911540, 14.378624]; // SE corner
  const bottomLeft: [number, number] = [120.906445, 14.377167];  // SW corner

  return [topLeft, topRight, bottomRight, bottomLeft];
};

const MapView = ({ apiKey, onFeatureClick, highlightedFeature, highlightedCoordinates, places, selectedCategory, selectedPlace, onMarkerClick }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const popup = useRef<maplibregl.Popup | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
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

        // Add GeoJSON source
        map.current.addSource('yume-data', {
          type: 'geojson',
          data: geojsonData,
        });

        // Find the Yume at Riverparks polygon for initial zoom
        const yumePolygon = geojsonData.features.find(
          (f: any) => f.geometry.type === 'Polygon' && f.properties.text === 'Yume at Riverparks'
        );

        // Get image bounds aligned to the polygon
        const imageCoordinates = getImageBounds();

        // Add georeferenced image source with exact PGW-derived coordinates
        map.current.addSource('yume-sdp-image', {
          type: 'image',
          url: '/images/yume-sdp-georef.png',
          coordinates: imageCoordinates,
        });

        // Add raster layer for the georeferenced image
        // Place it above base map but below labels by using 'beforeId'
        // Find a suitable label layer to insert before
        const layers = map.current.getStyle().layers;
        let labelLayerId: string | undefined;
        for (const layer of layers || []) {
          if (layer.type === 'symbol' && layer.layout?.['text-field']) {
            labelLayerId = layer.id;
            break;
          }
        }

        map.current.addLayer(
          {
            id: 'yume-sdp-layer',
            type: 'raster',
            source: 'yume-sdp-image',
            paint: {
              'raster-opacity': 0.95,
              'raster-fade-duration': 0,
            },
          },
          labelLayerId // Insert below labels
        );

        // Add polygon outline layer (above raster, for interaction)
        map.current.addLayer({
          id: 'polygon-outline',
          type: 'line',
          source: 'yume-data',
          filter: ['==', ['geometry-type'], 'Polygon'],
          paint: {
            'line-color': '#22c55e',
            'line-width': 2,
          },
        });

        // Add invisible polygon fill for click/hover detection
        map.current.addLayer({
          id: 'polygon-fill',
          type: 'fill',
          source: 'yume-data',
          filter: ['==', ['geometry-type'], 'Polygon'],
          paint: {
            'fill-color': 'transparent',
            'fill-opacity': 0,
          },
        });

        // Add LineString layer
        map.current.addLayer({
          id: 'linestrings',
          type: 'line',
          source: 'yume-data',
          filter: ['==', ['geometry-type'], 'LineString'],
          paint: {
            'line-color': '#373722',
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
            'line-color': '#373722',
            'line-width': 3,
            'line-opacity': 0.8,
          },
        });

        // Calculate bounds for all locations and features
        const allBounds = new maplibregl.LngLatBounds();
        
        // Include all place markers
        places.forEach(place => {
          allBounds.extend(place.coordinates);
        });

        // Include all GeoJSON features (polygons, lines, etc.)
        geojsonData.features.forEach((feature: any) => {
          if (feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates[0].forEach((coord: [number, number]) => {
              allBounds.extend(coord);
            });
          } else if (feature.geometry.type === 'LineString') {
            feature.geometry.coordinates.forEach((coord: [number, number]) => {
              allBounds.extend(coord);
            });
          } else if (feature.geometry.type === 'MultiLineString') {
            feature.geometry.coordinates.forEach((line: [number, number][]) => {
              line.forEach((coord: [number, number]) => {
                allBounds.extend(coord);
              });
            });
          } else if (feature.geometry.type === 'Point') {
            allBounds.extend(feature.geometry.coordinates);
          }
        });

        // Set max bounds to restrict map view with extra padding
        if (map.current) {
          const sw = allBounds.getSouthWest();
          const ne = allBounds.getNorthEast();
          const padding = 0.015;
          
          map.current.setMaxBounds([
            [sw.lng - padding, sw.lat - padding],
            [ne.lng + padding, ne.lat + padding]
          ]);

          // Initial zoom to the polygon area
          const coordinates = yumePolygon?.geometry.coordinates[0];
          if (coordinates) {
            const polygonBounds = coordinates.reduce(
              (bounds: maplibregl.LngLatBounds, coord: [number, number]) => {
                return bounds.extend(coord as [number, number]);
              },
              new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
            );

            map.current.fitBounds(polygonBounds, {
              padding: 100,
              duration: 2000,
            });
          }
        }

        // Add hover interactions for all interactive layers
        const interactiveLayers = ['polygon-fill', 'polygon-outline', 'linestrings', 'multilinestrings'];
        
        interactiveLayers.forEach((layer) => {
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
      markers.current.forEach(marker => marker.remove());
      if (map.current) map.current.remove();
    };
  }, [apiKey]);

  // Add markers for places
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Filter places based on selected category
    const filteredPlaces = selectedCategory 
      ? places.filter(place => place.type === selectedCategory)
      : places;

    // Create markers for filtered places
    filteredPlaces.forEach((place) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '36px';
      el.style.height = '36px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = 'white';
      el.style.border = `3px solid ${categoryColors[place.type]}`;
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      // Create icon container
      const iconContainer = document.createElement('div');
      createRoot(iconContainer).render(
        (() => {
          const Icon = categoryIcons[place.type];
          return <Icon size={18} color={categoryColors[place.type]} strokeWidth={2.5} />;
        })()
      );
      el.appendChild(iconContainer);

      // Click handler for marker
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onMarkerClick) {
          onMarkerClick(place.name, place.coordinates);
        }
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(place.coordinates)
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [isLoaded, places, selectedCategory, onMarkerClick]);

  // Close popup when category changes
  useEffect(() => {
    if (popup.current) {
      popup.current.remove();
    }
  }, [selectedCategory]);

  // Handle highlighted feature and coordinates with popup
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Always close any existing popup first
    if (popup.current) {
      popup.current.remove();
    }

    // If coordinates are provided directly, use them
    if (highlightedCoordinates && highlightedFeature) {
      // Special handling for Yume at Riverparks - zoom to polygon
      if (highlightedFeature === 'Yume at Riverparks') {
        fetch('/data/yume-riverpark.geojson')
          .then((res) => res.json())
          .then((data) => {
            const yumePolygon = data.features.find(
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
                duration: 1500,
              });
            }
          });
      } else {
        // Regular place - fly to coordinates and show popup
        map.current.flyTo({
          center: highlightedCoordinates,
          zoom: 16,
          duration: 1500,
          pitch: 45,
        });

        const place = places.find(p => p.name === highlightedFeature);
        
        if (place) {
          const popupContent = `
            <div style="padding: 8px;">
              <h3 style="font-weight: 600; margin-bottom: 8px; color: #1a1a1a;">${place.name}</h3>
              <div style="display: flex; gap: 16px; font-size: 13px; color: #666;">
                <div>
                  <div style="font-weight: 500;">Walking</div>
                  <div>${place.walkDistance}</div>
                </div>
                <div>
                  <div style="font-weight: 500;">Driving</div>
                  <div>${place.carDistance}</div>
                </div>
              </div>
            </div>
          `;

          popup.current = new maplibregl.Popup({
            closeButton: true,
            closeOnClick: true,
            offset: 15,
          })
            .setLngLat(highlightedCoordinates)
            .setHTML(popupContent)
            .addTo(map.current);
        }
      }
      
      return;
    }

    // Otherwise, find the feature in the GeoJSON
    if (!highlightedFeature) return;

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
  }, [highlightedFeature, highlightedCoordinates, isLoaded, places]);

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
