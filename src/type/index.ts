export interface ArchaeologicalSite {
  id: string;
  name: string;
  era: Era;
  category: Category;
  description: string;
  coordinates: [number, number]; // [latitude, longitude]
  image?: string; // URL to image
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
}