
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CrisisEvent, getCrisisTypeColor } from '@/services/crisisData';

// Mapbox token (for demo purposes only - use environment variables in production)
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHI2OHZyeDEwMjF4MnNwYzM2OW1rdndyIn0.Mjn2LpEeDGUZcT1FOD_wEw';

interface MapViewProps {
  events: CrisisEvent[];
  selectedEvent?: CrisisEvent;
  onEventSelect: (event: CrisisEvent) => void;
}

const MapView: React.FC<MapViewProps> = ({ events, selectedEvent, onEventSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-121.6219, 39.7596], // Paradise, CA - center of our crisis scenario
      zoom: 8,
      pitch: 30
    });
    
    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add navigation controls
      map.current?.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );
      
      // Add map layers
      if (map.current) {
        // Add prediction area for the wildfire (mock data)
        map.current.addSource('wildfire-prediction', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-121.6319, 39.7696],
                [-121.5919, 39.7696],
                [-121.5919, 39.7396],
                [-121.6319, 39.7396],
                [-121.6319, 39.7696]
              ]]
            },
            properties: {} // Add properties to satisfy GeoJSON.Feature type
          } as GeoJSON.Feature<GeoJSON.Geometry, { [key: string]: any }>
        });
        
        map.current.addLayer({
          id: 'wildfire-prediction-area',
          type: 'fill',
          source: 'wildfire-prediction',
          paint: {
            'fill-color': '#ff7000',
            'fill-opacity': 0.2
          }
        });
        
        map.current.addLayer({
          id: 'wildfire-prediction-outline',
          type: 'line',
          source: 'wildfire-prediction',
          paint: {
            'line-color': '#ff7000',
            'line-width': 2,
            'line-dasharray': [2, 1]
          }
        });
      }
    });
    
    return () => {
      map.current?.remove();
    };
  }, []);
  
  // Add/update event markers when events change
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    
    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.crisis-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    // Add markers for each event
    events.forEach(event => {
      const { lat, lng } = event.location.coordinates;
      
      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'crisis-marker';
      markerEl.style.width = '20px';
      markerEl.style.height = '20px';
      markerEl.style.borderRadius = '50%';
      markerEl.style.backgroundColor = getCrisisTypeColor(event.type);
      markerEl.style.border = '2px solid #fff';
      markerEl.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.25)';
      markerEl.style.cursor = 'pointer';
      
      // Add pulse effect for critical events
      if (event.severity === 'critical') {
        markerEl.style.boxShadow = `0 0 0 2px rgba(0, 0, 0, 0.25), 0 0 0 0 ${getCrisisTypeColor(event.type)}`;
        markerEl.style.animation = 'pulse 2s infinite';
      }
      
      // Selected event styling
      if (selectedEvent && selectedEvent.id === event.id) {
        markerEl.style.width = '30px';
        markerEl.style.height = '30px';
        markerEl.style.zIndex = '10';
        markerEl.style.border = '3px solid #fff';
      }
      
      // Create and add popup
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
        className: 'crisis-popup'
      }).setHTML(`
        <div style="font-weight: 600; margin-bottom: 4px;">${event.title}</div>
        <div style="font-size: 12px; color: #ccc;">${event.type} • ${event.severity}</div>
      `);
      
      // Create and add marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);
      
      // Add event listeners
      markerEl.addEventListener('click', () => {
        onEventSelect(event);
      });
      
      markerEl.addEventListener('mouseenter', () => {
        popup.addTo(map.current!);
      });
      
      markerEl.addEventListener('mouseleave', () => {
        popup.remove();
      });
    });
    
    // Fly to selected event
    if (selectedEvent) {
      const { lat, lng } = selectedEvent.location.coordinates;
      map.current.flyTo({
        center: [lng, lat],
        zoom: 10,
        duration: 1500
      });
    }
  }, [events, selectedEvent, mapLoaded, onEventSelect]);
  
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <style dangerouslySetInnerHTML={{ __html: `
        .crisis-popup .mapboxgl-popup-content {
          background-color: #123E59;
          color: white;
          border-radius: 4px;
          padding: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        
        .crisis-popup .mapboxgl-popup-tip {
          border-top-color: #123E59;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(217, 37, 37, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(217, 37, 37, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(217, 37, 37, 0);
          }
        }
      `}} />
    </div>
  );
};

export default MapView;
