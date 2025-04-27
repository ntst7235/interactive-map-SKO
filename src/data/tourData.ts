import { PanoramaData } from '../types';

export const tourData: Record<string, PanoramaData> = {
  '1': {
    initialPanorama: 'entrance',
    panoramas: {
      entrance: {
        id: 'entrance',
        name: 'Settlement Entrance',
        image: 'https://images.unsplash.com/photo-1518128160709-c5d87c68c98e?auto=format&fit=crop&q=80&w=3000',
        hotspots: [
          {
            type: 'panorama',
            id: 'courtyard',
            pitch: 0,
            yaw: 30,
            text: 'Go to Courtyard',
            targetPanorama: 'courtyard'
          },
          {
            type: 'image',
            id: 'artifact-1',
            pitch: -20,
            yaw: -45,
            text: 'View Artifact',
            image: 'https://images.unsplash.com/photo-1599833975787-5c143f373c30?auto=format&fit=crop&q=80&w=3000'
          }
        ]
      },
      courtyard: {
        id: 'courtyard',
        name: 'Central Courtyard',
        image: 'https://images.unsplash.com/photo-1600096194534-95cf5b4e8f95?auto=format&fit=crop&q=80&w=3000',
        hotspots: [
          {
            type: 'panorama',
            id: 'entrance',
            pitch: 0,
            yaw: -150,
            text: 'Return to Entrance',
            targetPanorama: 'entrance'
          },
          {
            type: 'image',
            id: 'artifact-2',
            pitch: -15,
            yaw: 60,
            text: 'View Pottery Collection',
            image: 'https://images.unsplash.com/photo-1618999114504-4e0c6f7f58dd?auto=format&fit=crop&q=80&w=3000'
          }
        ]
      }
    }
  }
};