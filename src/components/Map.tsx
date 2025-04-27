import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ImageOverlay } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArchaeologicalSite, MapState } from '../types';
import SiteDetailPanel from './SiteDetailPanel';
import LayerSwitcher from './LayerSwitcher';
import { useTheme } from '../contexts/ThemeContext';

interface MapProps {
  mapState: MapState;
  sites: ArchaeologicalSite[];
  onSelectSite: (site: ArchaeologicalSite | null) => void;
  sidebarOpen: boolean;
  toggleSidebar: (forcedState?: boolean) => void;
  overlayConfig: {
    enabled: boolean;
    selectedMap: string;
    opacity: number;
  };
}

const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function isValidCoordinates(coords: any): coords is [number, number] {
  return (
    Array.isArray(coords) &&
    coords.length === 2 &&
    typeof coords[0] === 'number' &&
    typeof coords[1] === 'number' &&
    !isNaN(coords[0]) &&
    !isNaN(coords[1]) &&
    coords[0] >= -90 && 
    coords[0] <= 90 && 
    coords[1] >= -180 && 
    coords[1] <= 180
  );
}

const MapController: React.FC<{ 
  center: [number, number]; 
  zoom: number; 
  sidebarOpen: boolean;
}> = ({ 
  center, 
  zoom, 
  sidebarOpen
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (map && isValidCoordinates(center)) {
      map.setView(center, zoom, { animate: false });
    }
  }, [map, center, zoom]);

  useEffect(() => {
    if (map) {
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [sidebarOpen, map]);
  
  return null;
};

const Map: React.FC<MapProps> = ({ 
  mapState, 
  sites, 
  onSelectSite, 
  sidebarOpen, 
  toggleSidebar,
  overlayConfig 
}) => {
  const [currentLayer, setCurrentLayer] = useState('default');
  const [isMapReady, setIsMapReady] = useState(false);
  const markerRefs = useRef<{ [key: string]: any }>({});
  const { theme } = useTheme();

  const overlayBounds: LatLngBounds = new LatLngBounds(
    [51.538597, 64.347327],
    [55.784217, 72.030899]
  );

  useEffect(() => {
    if (mapState.selectedSite && markerRefs.current[mapState.selectedSite.id]) {
      markerRefs.current[mapState.selectedSite.id].openPopup();
    }
  }, [mapState.selectedSite]);

  const layers = {
    default: {
      url: theme === 'dark' 
        ? 'https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=rZAyeIZOUpOABx2sxmdKsDaP7zBK5xkBp0PIQQtcZrIqVT7mansJSbjd3R0EQAi4'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: theme === 'dark'
        ? '&copy; <a href="https://www.jawg.io" target="_blank">&copy; Jawg</a> - &copy; <a href="https://www.openstreetmap.org" target="_blank">&copy; OpenStreetMap</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      attribution: '&copy; Google'
    }
  };

  const validSites = sites.filter(site => {
    if (!site || !site.id || !site.name) {
      console.warn('Site missing required fields:', site);
      return false;
    }
    if (!isValidCoordinates(site.coordinates)) {
      console.warn(`Invalid coordinates for site ${site.name}:`, site.coordinates);
      return false;
    }
    return true;
  });

  if (validSites.length !== sites.length) {
    console.warn(`Filtered out ${sites.length - validSites.length} sites with invalid data`);
  }

  const handleLayerChange = (layer: string) => {
    setCurrentLayer(layer);
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={mapState.center}
        zoom={mapState.zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        whenReady={() => {
          console.log('Map is ready');
          setIsMapReady(true);
        }}
      >
        <TileLayer
          url={layers[currentLayer as keyof typeof layers].url}
          attribution={layers[currentLayer as keyof typeof layers].attribution}
        />
        
        {overlayConfig.enabled && overlayConfig.selectedMap === 'historical' && (
          <ImageOverlay
            url="/historical-maps/petropavlovskiy-uezd-1912.jpg"
            bounds={overlayBounds}
            opacity={overlayConfig.opacity / 100}
          />
        )}
        
        <MapController 
          center={mapState.center} 
          zoom={mapState.zoom} 
          sidebarOpen={sidebarOpen}
        />
        
        {validSites.map(site => (
          site && isValidCoordinates(site.coordinates) ? (
            <Marker
              key={site.id}
              position={site.coordinates}
              icon={site.icon ? new Icon({ iconUrl: `/icons/${site.icon}`, iconSize: [25, 41], iconAnchor: [12, 10] }) : defaultIcon}
              eventHandlers={{
                click: () => onSelectSite(site),
              }}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[site.id] = ref;
                }
              }}
            >
              <Popup>
                <div className="text-center bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                  <h3 className="font-medium">{site.name}</h3>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
      
      {mapState.selectedSite && (
        <SiteDetailPanel
          site={mapState.selectedSite}
          onClose={() => onSelectSite(null)}
          toggleSidebar={toggleSidebar}
        />
      )}

      {isMapReady && (
        <LayerSwitcher
          currentLayer={currentLayer}
          onLayerChange={handleLayerChange}
        />
      )}
    </div>
  );
};

export default Map;