
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CrisisEvent, getCrisisTypeColor } from '@/services/crisisData';
import MapControls from '@/components/MapControls';
import { toast } from 'sonner';

// Mapbox token (for demo purposes only - use environment variables in production)
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHI2OHZyeDEwMjF4MnNwYzM2OW1rdndyIn0.Mjn2LpEeDGUZcT1FOD_wEw';

interface MapViewProps {
  events: CrisisEvent[];
  selectedEvent?: CrisisEvent;
  onEventSelect: (event: CrisisEvent) => void;
  onReportIncident?: () => void;
}

const MapView: React.FC<MapViewProps> = ({ 
  events, 
  selectedEvent, 
  onEventSelect,
  onReportIncident 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userLocationMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showPredictions, setShowPredictions] = useState(true);
  const [showResolved, setShowResolved] = useState(false);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number, lng: number } | null>(null);
  
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
        
        // Add animated pulse effect for the wildfire centroid
        map.current.addLayer({
          id: 'wildfire-centroid',
          type: 'circle',
          source: 'wildfire-prediction',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              8, 15,
              12, 30
            ],
            'circle-color': '#ff7000',
            'circle-opacity': 0.3,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ff7000'
          }
        });
      }
    });
    
    return () => {
      map.current?.remove();
    };
  }, []);
  
  // Toggle prediction layers visibility
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    
    const layers = [
      'wildfire-prediction-area',
      'wildfire-prediction-outline',
      'wildfire-centroid'
    ];
    
    layers.forEach(layer => {
      if (map.current) {
        map.current.setLayoutProperty(
          layer, 
          'visibility', 
          showPredictions ? 'visible' : 'none'
        );
      }
    });
  }, [showPredictions, mapLoaded]);
  
  // Handle user location
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    
    if (showUserLocation) {
      if (userCoordinates) {
        // If we already have user coordinates, use them
        addUserLocationMarker(userCoordinates.lat, userCoordinates.lng);
      } else {
        // Request user location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserCoordinates({ lat: latitude, lng: longitude });
            addUserLocationMarker(latitude, longitude);
          },
          (error) => {
            console.error('Error getting user location:', error);
            toast.error('Could not get your location. Please enable location services.');
            setShowUserLocation(false);
          },
          { enableHighAccuracy: true }
        );
      }
    } else if (userLocationMarker.current) {
      // Remove user marker if toggle is off
      userLocationMarker.current.remove();
      userLocationMarker.current = null;
    }
  }, [showUserLocation, mapLoaded, userCoordinates]);
  
  // Add user location marker
  const addUserLocationMarker = (lat: number, lng: number) => {
    if (!map.current) return;
    
    // Create a DOM element for the custom marker
    const el = document.createElement('div');
    el.className = 'user-location-marker';
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#4299e1';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.25)';
    el.style.position = 'relative';
    
    // Add the pulsing effect
    const pulse = document.createElement('div');
    pulse.className = 'user-location-pulse';
    pulse.style.position = 'absolute';
    pulse.style.top = '-10px';
    pulse.style.left = '-10px';
    pulse.style.right = '-10px';
    pulse.style.bottom = '-10px';
    pulse.style.borderRadius = '50%';
    pulse.style.border = '3px solid #4299e1';
    pulse.style.animation = 'pulse 2s infinite';
    el.appendChild(pulse);
    
    // Remove existing marker if there is one
    if (userLocationMarker.current) {
      userLocationMarker.current.remove();
    }
    
    // Create and add new marker
    userLocationMarker.current = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(map.current);
    
    // Add popup for the user location marker
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 25,
      className: 'crisis-popup'
    }).setHTML('<div>Your Location</div>');
    
    // Add event listeners
    el.addEventListener('mouseenter', () => {
      popup.setLngLat([lng, lat]).addTo(map.current!);
    });
    
    el.addEventListener('mouseleave', () => {
      popup.remove();
    });
  };
  
  // Add/update event markers when events change
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    
    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.crisis-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    // Filter events based on settings
    const filteredEvents = events.filter(event => {
      // If showResolved is false, hide events that are marked as resolved
      return showResolved || event.verified !== true;
    });
    
    // Add markers for each event
    filteredEvents.forEach(event => {
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
        <div style="font-size: 12px; margin-top: 4px; color: #eee;">
          ${event.affectedPopulation 
            ? `<strong>${event.affectedPopulation.toLocaleString()}</strong> people affected` 
            : ''}
        </div>
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
  }, [events, selectedEvent, mapLoaded, onEventSelect, showResolved]);
  
  // Center map handler
  const handleCenterMap = () => {
    if (!map.current) return;
    
    map.current.flyTo({
      center: [-121.6219, 39.7596],
      zoom: 8,
      pitch: 30,
      duration: 2000
    });
  };
  
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <MapControls 
        showPredictions={showPredictions}
        onTogglePredictions={() => setShowPredictions(!showPredictions)}
        onCenterMap={handleCenterMap}
        showResolved={showResolved}
        onToggleResolved={() => setShowResolved(!showResolved)}
        showUserLocation={showUserLocation}
        onToggleUserLocation={() => setShowUserLocation(!showUserLocation)}
        onReportIncident={onReportIncident || (() => {})}
      />
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
        
        .user-location-pulse {
          animation: user-pulse 2s infinite;
        }
        
        @keyframes user-pulse {
          0% {
            transform: scale(0.7);
            opacity: 1;
          }
          70% {
            transform: scale(1.5);
            opacity: 0;
          }
          100% {
            transform: scale(0.7);
            opacity: 0;
          }
        }
      `}} />
    </div>
  );
};

export default MapView;
