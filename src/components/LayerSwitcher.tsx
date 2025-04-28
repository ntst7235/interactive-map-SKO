import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LayerSwitcherProps {
  currentLayer: string;
  onLayerChange: (layer: string) => void;
}

const LayerSwitcher: React.FC<LayerSwitcherProps> = ({ currentLayer, onLayerChange }) => {
  const previewMapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const layers = {
    default: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      label: 'Карта'
    },
    satellite: {
      url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      label: 'Спутник'
    }
  };

  const alternateLayer = currentLayer === 'default' ? 'satellite' : 'default';

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || isInitialized) return;

    const container = containerRef.current;
    const map = L.map(container, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false
    }).setView([51.505, -0.09], 13);

    L.tileLayer(layers[alternateLayer].url).addTo(map);
    previewMapRef.current = map;
    setIsInitialized(true);

    return () => {
      if (previewMapRef.current) {
        previewMapRef.current.remove();
        previewMapRef.current = null;
        setIsInitialized(false);
      }
    };
  }, []); // Only run once on mount

  // Update layer when currentLayer changes
  useEffect(() => {
    if (!isInitialized || !previewMapRef.current) return;

    const map = previewMapRef.current;
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    L.tileLayer(layers[alternateLayer].url).addTo(map);
  }, [currentLayer]); // Only run when currentLayer changes

  // Sync with main map
  useEffect(() => {
    if (!isInitialized || !previewMapRef.current) return;

    const handleMainMapMove = () => {
      const mainMap = document.querySelector('.leaflet-container');
      if (!mainMap || !previewMapRef.current) return;

      const mapInstance = (mainMap as any)._leaflet_map;
      if (!mapInstance) return;

      const center = mapInstance.getCenter();
      const zoom = Math.max(mapInstance.getZoom() - 1, 0);
      previewMapRef.current.setView(center, zoom, { animate: false });
    };

    const mainMap = document.querySelector('.leaflet-container');
    if (mainMap) {
      const mapInstance = (mainMap as any)._leaflet_map;
      if (mapInstance) {
        mapInstance.on('moveend', handleMainMapMove);
        handleMainMapMove();
      }
    }

    return () => {
      const mainMap = document.querySelector('.leaflet-container');
      if (mainMap) {
        const mapInstance = (mainMap as any)._leaflet_map;
        if (mapInstance) {
          mapInstance.off('moveend', handleMainMapMove);
        }
      }
    };
  }, [isInitialized]);

  return (
    <div className="layer-switcher">
      <div 
        onClick={() => onLayerChange(alternateLayer)}
        className="relative bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-200"
      >
        <div 
          ref={containerRef} 
          className="layer-switcher-preview w-full h-full"
          style={{ minHeight: '64px' }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-20">
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white text-center py-1 text-xs font-medium">
            {layers[alternateLayer].label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerSwitcher;