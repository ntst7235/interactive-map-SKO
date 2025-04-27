import express from 'express';
import { getAllLocations } from '../controllers/locationController.js';
import { getLocationById } from '../controllers/locationController.js';

const router = express.Router();

router.get('/', getAllLocations);
router.get('/:id', getLocationById);

export default router;