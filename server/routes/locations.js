import express from 'express';
import { getAllLocations } from '../controllers/locationController.js';
import { getLocationById } from '../controllers/locationController.js';
import { getLocationPanorama } from '../controllers/locationController.js';

const router = express.Router();

router.get('/', getAllLocations);
router.get('/:id', getLocationById);
router.get('/:id/panorama', getLocationPanorama);

export default router;