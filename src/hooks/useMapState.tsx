import { useState, useCallback, useMemo, useEffect } from 'react';
import { ArchaeologicalSite, FilterState, MapState } from '../types';

const DEFAULT_COORDINATES: [number, number] = [54.87415613441362, 69.14992027973634];
const DEFAULT_ZOOM = 13;

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

function parseCoordinates(coords: any): [number, number] | null {
  if (!coords) return null;
  
  // Handle nested lat/lng object structure
  if (coords && typeof coords === 'object' && 'lat' in coords && 'lng' in coords) {
    const lat = Number(coords.lat);
    const lng = Number(coords.lng);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return [lat, lng];
    }
  }
  
  // Handle string coordinates (e.g., "[51.505, -0.09]")
  if (typeof coords === 'string') {
    try {
      coords = JSON.parse(coords);
    } catch (e) {
      return null;
    }
  }
  
  // Handle array-like objects
  if (Array.isArray(coords) && coords.length === 2) {
    const [lat, lng] = coords.map(Number);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return [lat, lng];
    }
  }
  
  return null;
}

export function useMapState() {
  const [mapState, setMapState] = useState<MapState>({
    center: DEFAULT_COORDINATES,
    zoom: DEFAULT_ZOOM,
    selectedSite: null,
  });

  const [filters, setFilters] = useState<FilterState>({
    era: [],
    category: [],
    searchQuery: '',
    has3DTour: false,
  });

  const [sites, setSites] = useState<ArchaeologicalSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const queryParams = new URLSearchParams();
        if (filters.era.length > 0) {
          queryParams.append('era', filters.era[0]);
        }
        if (filters.category.length > 0) {
          queryParams.append('category', filters.category[0]);
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/locations?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch sites');
        
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid data format');
        
        const processedSites = data
          .map(site => {
            const parsedCoords = parseCoordinates(site.coordinates);
            if (!parsedCoords) {
              console.warn(`Invalid coordinates for site ${site.name || 'Unnamed Site'}, skipping site`);
              return null;
            }

            return {
              id: site.id || `site-${Math.random().toString(36).substr(2, 9)}`,
              name: site.name || 'Unnamed Site',
              icon: site.icon || '',
              coordinates: parsedCoords,
              era: site.era || 'Unknown Era',
              category: site.category || 'Uncategorized',
              description: site.description || 'No description available',
              image: site.image || undefined,
              images: Array.isArray(site.images) ? site.images : [],
              has3DTour: site.has3DTour || false,
            } as ArchaeologicalSite;
          })
          .filter((site): site is ArchaeologicalSite => site !== null);

        setSites(processedSites);
      } catch (error) {
        console.error('Error fetching sites:', error);
        setError(error instanceof Error ? error.message : 'Failed to load sites');
        setSites([]); // Reset sites on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSites();
  }, [filters.era, filters.category]);

  const toggleSidebar = useCallback((forcedState?: boolean) => {
    setSidebarOpen(prev => typeof forcedState === 'boolean' ? forcedState : !prev);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [sidebarOpen]);

  const selectSite = useCallback((site: ArchaeologicalSite | null) => {
    setMapState(prev => ({
      ...prev,
      selectedSite: site,
    }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetView = useCallback(() => {
    setMapState({
      center: DEFAULT_COORDINATES,
      zoom: DEFAULT_ZOOM,
      selectedSite: null,
    });
  }, []);

  const filteredSites = useMemo(() => {
    return sites.filter(site => {
      if (!site || !site.name) return false;
      if (filters.searchQuery && !site.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      if (filters.has3DTour && !site.has3DTour) {
        return false;
      }
      return true;
    });
  }, [sites, filters.searchQuery, filters.has3DTour]);

  const searchResults = useMemo(() => {
    if (!filters.searchQuery) return [];
    
    return sites
      .filter(site => site.name.toLowerCase().includes(filters.searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [sites, filters.searchQuery]);

  const moveToMarker = useCallback((coordinates: [number, number]) => {
    setMapState(prev => ({
      ...prev,
      center: coordinates,
    }));
  }, []);

  return {
    mapState,
    filters,
    sidebarOpen,
    filteredSites,
    searchResults,
    isLoading,
    error,
    selectSite,
    updateFilters,
    toggleSidebar,
    resetView,
    moveToMarker,
  };
}