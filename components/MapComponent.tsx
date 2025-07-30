
import React, { useEffect, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Destination } from '../types';
import MapPinIcon from './icons/MapPinIcon';
import DirectionsIcon from './icons/DirectionsIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

declare var L: any; // Use Leaflet from CDN

interface MapComponentProps {
  destination: Destination | null;
  onGetDirections: (destination: Destination) => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalDestinations: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ destination, onGetDirections, onPrev, onNext, currentIndex, totalDestinations }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any | null>(null);
  const markerRef = useRef<any | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-1.9403, 29.8739], // Center of Rwanda
        zoom: 8,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapRef.current = map;
    }
  }, []);

  // Handle destination changes
  useEffect(() => {
    if (mapRef.current && destination) {
        const { lat, lng, name } = destination;
        const iconMarkup = renderToStaticMarkup(<MapPinIcon className="h-10 w-10 text-blue-600 drop-shadow-lg" />);
        const customIcon = L.divIcon({
            html: iconMarkup,
            className: '',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });

        // Remove old marker
        if (markerRef.current) {
            markerRef.current.remove();
        }

        // Add new marker
        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(mapRef.current);

        // Create popup content
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
            <div class="font-sans">
                <h3 class="font-bold text-md mb-2">${name}</h3>
            </div>
        `;
        const button = document.createElement('button');
        button.className = "flex items-center space-x-2 w-full justify-center px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500";
        const iconSpan = document.createElement('span');
        iconSpan.innerHTML = renderToStaticMarkup(<DirectionsIcon className="h-4 w-4" />);
        button.appendChild(iconSpan);
        const textSpan = document.createElement('span');
        textSpan.innerText = 'Get Directions';
        button.appendChild(textSpan);

        button.onclick = () => onGetDirections(destination);
        popupContent.appendChild(button);

        markerRef.current.bindPopup(popupContent).openPopup();
        
        mapRef.current.flyTo([lat, lng], 13); // Zoom into the location
    }
  }, [destination, onGetDirections]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full bg-gray-200 dark:bg-gray-800" />
      {totalDestinations > 1 && (
        <div className="absolute bottom-4 left-4 z-[1000] flex items-center space-x-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-1 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <button
            onClick={onPrev}
            disabled={currentIndex <= 0}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous destination"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2 tabular-nums">
            {currentIndex + 1} / {totalDestinations}
          </span>
          <button
            onClick={onNext}
            disabled={currentIndex >= totalDestinations - 1}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next destination"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
