export interface ArchaeologicalSite {
  id: string;
  name: string;
  icon: string;
  era: Era;
  category: Category;
  description: string;
  coordinates: [number, number]; // [latitude, longitude]
  image?: string; // URL to image
  images?: string[]; // Array of image URLs
  has3DTour?: boolean;
}

export type Era = 'Stone Age' | 'Bronze Age' | 'Iron Age' | 'Roman' | 'Medieval' | 'Modern';

export type Category = 'Settlement' | 'Burial' | 'Artifact' | 'Fortress' | 'Religious' | 'Other';

export interface MapState {
  center: [number, number];
  zoom: number;
  selectedSite: ArchaeologicalSite | null;
}

export interface FilterState {
  era: Era[];
  category: Category[];
  searchQuery: string;
  has3DTour: boolean;
}

export interface Hotspot {
  id: string;
  type: 'panorama' | 'image' | '3d-model';
  pitch: number;
  yaw: number;
  text: string;
  targetPanorama?: string;
  image?: string;
  model?: string;
}

export interface PanoramaScene {
  id: string;
  name: string;
  image: string;
  hotspots: Hotspot[];
}

export interface PanoramaData {
  initialPanorama: string;
  panoramas: Record<string, PanoramaScene>;
}