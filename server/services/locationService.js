import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PLACEHOLDER_IMAGE = 'https://images.pexels.com/photos/36006/renaissance-schallaburg-figures-facade.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

export const getEnrichedLocations = async () => {
  try {
    const data = await readFile(join(__dirname, '../../src/data/locationObjects.json'), 'utf8');
    const locations = JSON.parse(data);
    
    // Enrich the data with additional fields
    return locations.map(location => ({
      ...location,
      era: location.era || 'Unknown', // Placeholder for future categorization
      category: location.category || 'Unknown', // Placeholder for future categorization
      description: location.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: location.image || PLACEHOLDER_IMAGE,
      // has3DTour: location.has3DTour || false,
      features: [
        'Original architectural elements',
        'Well-preserved structures',
        'Archaeological evidence',
        'Cultural significance'
      ],
      historicalContext: location.historicalContext || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      visitingInfo: {
        openingHours: 'Dawn to dusk',
        admission: 'Free',
        facilities: ['Parking', 'Information boards'],
        accessibility: 'Moderate'
      }
    }));
  } catch (error) {
    console.error('Error reading locations data:', error);
    throw new Error('Failed to load locations data');
  }
};