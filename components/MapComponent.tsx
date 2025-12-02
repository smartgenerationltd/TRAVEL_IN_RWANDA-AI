
import React, { useEffect, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Destination } from '../types';
import MapPinIcon from './icons/MapPinIcon';
import DirectionsIcon from './icons/DirectionsIcon';
import CrosshairIcon from './icons/CrosshairIcon';

declare var L: any; // Use Leaflet from CDN

interface MapComponentProps {
  destinations: Destination[];
  userLocation: { lat: number; lng: number } | null;
  onGetDirections: (destination: Destination) => void;
  onRequestLocate: () => void;
  getDirectionsText: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  destinations, 
  userLocation, 
  onGetDirections, 
  onRequestLocate, 
  getDirectionsText 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any | null>(null);
  const markerLayerRef = useRef<any | null>(null);
  const userMarkerRef = useRef<any | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-1.9403, 29.8739], // Center of Rwanda
        zoom: 9,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapRef.current = map;
      markerLayerRef.current = L.featureGroup().addTo(map);
    }
  }, []);

  // Handle user location marker
  useEffect(() => {
    if (mapRef.current) {
      if (userMarkerRef.current) {
        mapRef.current.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }

      if (userLocation) {
        const userIconMarkup = renderToStaticMarkup(
          <div className="relative flex h-6 w-6 items-center justify-center -ml-3 -mt-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-sm"></span>
          </div>
        );

        const customIcon = L.divIcon({
          html: userIconMarkup,
          className: 'bg-transparent',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([userLocation.lat, userLocation.lng], { icon: customIcon });
        marker.bindPopup(`<div class="font-sans font-bold text-sm">You are here</div>`);
        marker.addTo(mapRef.current);
        userMarkerRef.current = marker;
        
        // If it's the first time finding location or no other destinations, fly to user
        if (destinations.length === 0) {
            mapRef.current.flyTo([userLocation.lat, userLocation.lng], 13);
        }
      }
    }
  }, [userLocation, destinations.length]);

  // Handle destination changes
  useEffect(() => {
    if (mapRef.current && markerLayerRef.current) {
      markerLayerRef.current.clearLayers();

      const iconMarkup = renderToStaticMarkup(<MapPinIcon className="h-10 w-10 text-red-600 drop-shadow-lg" />);
      const customIcon = L.divIcon({
          html: iconMarkup,
          className: '',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40]
      });

      destinations.forEach(destination => {
        const { lat, lng, name } = destination;
        const marker = L.marker([lat, lng], { icon: customIcon });

        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
            <div class="font-sans min-w-[150px]">
                <h3 class="font-bold text-md mb-2 text-gray-800">${name}</h3>
            </div>
        `;
        const button = document.createElement('button');
        button.className = "flex items-center space-x-2 w-full justify-center px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2";
        const iconSpan = document.createElement('span');
        iconSpan.innerHTML = renderToStaticMarkup(<DirectionsIcon className="h-4 w-4" />);
        button.appendChild(iconSpan);
        const textSpan = document.createElement('span');
        textSpan.innerText = getDirectionsText;
        button.appendChild(textSpan);

        button.onclick = () => onGetDirections(destination);
        popupContent.appendChild(button);

        marker.bindPopup(popupContent);
        markerLayerRef.current.addLayer(marker);
      });
      
      if (destinations.length > 0) {
        const bounds = markerLayerRef.current.getBounds();
        // Include user location in bounds if available
        if (userLocation) {
             bounds.extend([userLocation.lat, userLocation.lng]);
        }
        mapRef.current.flyToBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [destinations, onGetDirections, getDirectionsText, userLocation]);

  return (
    <div className="relative h-full w-full group">
      <div ref={mapContainerRef} className="h-full w-full bg-gray-200 dark:bg-gray-800" />
      
      {/* Locate Me Button */}
      <button
        onClick={onRequestLocate}
        className="absolute top-4 right-4 z-[400] bg-white dark:bg-gray-800 p-2 rounded-md shadow-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        title="Show my location"
      >
        <CrosshairIcon className={`h-6 w-6 ${userLocation ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`} />
      </button>
    </div>
  );
};

export default MapComponent;
