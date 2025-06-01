import Location from '../models/Location.js';
import Category from '../models/Category.js';
import Era from '../models/Era.js';
import Panorama from '../models/Panorama.js';

export const getAllLocations = async (req, res) => {
  try {
    const { era, category } = req.query;
    
    const query = {};
    if (era) {
      const eraDoc = await Era.findOne({ name: era });
      if (eraDoc) {
        query.eraId = eraDoc._id;
      }
    }
    
    if (category) {
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        query.categoryId = categoryDoc._id;
      }
    }
    
    const locations = await Location.find(query)
      .populate('categoryId', 'name')
      .populate('eraId', 'name')
      .populate('panoramaId');
    
    const enrichedLocations = locations.map(loc => ({
      id: loc._id,
      name: loc.name,
      description: loc.description,
      historicalContext: loc.historicalContext,
      coordinates: [loc.coordinates.lat, loc.coordinates.lng],
      icon: loc.icon,
      image: loc.image,
      category: loc.categoryId.name,
      era: loc.eraId.name,
      has3DTour: !!loc.panoramaId
    }));
    
    res.json(enrichedLocations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id)
      .populate('categoryId', 'name')
      .populate('eraId', 'name')
      .populate('panoramaId');
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    const enrichedLocation = {
      id: location._id,
      name: location.name,
      description: location.description,
      historicalContext: location.historicalContext,
      coordinates: [location.coordinates.lat, location.coordinates.lng],
      icon: location.icon,
      image: location.image,
      category: location.categoryId.name,
      era: location.eraId.name,
      has3DTour: !!location.panoramaId
    };
    
    res.json(enrichedLocation);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

export const getLocationPanorama = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id).populate('panoramaId');
    
    if (!location || !location.panoramaId) {
      return res.status(404).json({ error: 'Panorama not found for this location' });
    }
    
    res.json(location.panoramaId);
  } catch (error) {
    console.error('Error fetching panorama:', error);
    res.status(500).json({ error: 'Failed to fetch panorama' });
  }
};