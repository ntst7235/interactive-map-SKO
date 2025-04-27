import { getEnrichedLocations } from '../services/locationService.js';

export const getAllLocations = async (req, res) => {
  try {
    const { era, category } = req.query;
    const locations = await getEnrichedLocations();
    
    let filteredLocations = locations;
    
    if (era) {
      filteredLocations = filteredLocations.filter(loc => loc.era === era);
    }
    
    if (category) {
      filteredLocations = filteredLocations.filter(loc => loc.category === category);
    }
    
    res.json(filteredLocations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const locations = await getEnrichedLocations();
    const location = locations.find(loc => loc.id.toString() === id);
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};