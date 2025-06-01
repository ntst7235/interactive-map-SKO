import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Category from './models/Category.js';
import Era from './models/Era.js';
import Location from './models/Location.js';
import Panorama from './models/Panorama.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Category.deleteMany({}),
      Era.deleteMany({}),
      Location.deleteMany({}),
      Panorama.deleteMany({})
    ]);

    // Create categories
    const categories = await Category.create([
      { name: 'Поселения' },
      { name: 'Захоронения' },
      { name: 'Артефакты' },
      { name: 'Крепости' },
      { name: 'Религиозные' },
      { name: 'Остальное' }
    ]);

    // Create eras
    const eras = await Era.create([
      { name: 'Каменный век' },
      { name: 'Бронзовый век' },
      { name: 'Железный век' },
      { name: 'Римская эпоха' },
      { name: 'Средневековье' },
      { name: 'Современность' }
    ]);

    // Read and import locations
    const locationsData = JSON.parse(
      await readFile(join(__dirname, '../src/data/locationObjects.json'), 'utf8')
    );

    // Read and import panoramas
    const panoramasData = JSON.parse(
      await readFile(join(__dirname, '../src/data/panoramasInfo.json'), 'utf8')
    );

    // Map categories and eras to their MongoDB IDs
    const categoryMap = Object.fromEntries(
      categories.map(cat => [cat.name, cat._id])
    );
    const eraMap = Object.fromEntries(
      eras.map(era => [era.name, era._id])
    );

    // Create panoramas first
    const panoramas = await Panorama.create(
      panoramasData.map(p => ({
        name: p.name,
        initialPanorama: p.initialPanorama,
        scenes: p.panoramas ? Object.values(p.panoramas).map(scene => ({
          id: scene.id,
          name: scene.name,
          image: scene.image,
          hotspots: scene.hotspots || []
        })) : []
      }))
    );

    // Create locations with references to panoramas
    const locations = await Location.create(
      locationsData.map(loc => ({
        name: loc.name,
        description: loc.description,
        historicalContext: loc.historicalContext,
        coordinates: {
          lat: loc.coordinates.lat,
          lng: loc.coordinates.lng
        },
        icon: loc.icon,
        image: loc.image,
        categoryId: categoryMap[loc.category] || categoryMap['Остальное'],
        eraId: eraMap[loc.era] || eraMap['Современность'],
        panoramaId: panoramas.find(p => p.name === loc.name)?._id
      }))
    );

    // Update panoramas with location references
    await Promise.all(
      panoramas.map(async panorama => {
        const location = locations.find(loc => loc.name === panorama.name);
        if (location) {
          panorama.locationId = location._id;
          await panorama.save();
        }
      })
    );

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed()