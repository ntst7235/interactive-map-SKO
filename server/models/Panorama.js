import mongoose from 'mongoose';

const hotspotSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['panorama', 'image'], 
    required: true 
  },
  id: { 
    type: String, 
    required: true 
  },
  targetPanorama: { 
    type: String, 
    required: true 
  },
  pitch: Number,
  yaw: Number,
  text: String
}, { _id: false });

const sceneSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true 
  },
  name: String,
  image: { 
    type: String, 
    required: true 
  },
  hotspots: [hotspotSchema]
}, { _id: false });

const panoramaSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  initialPanorama: { 
    type: String, 
    required: true 
  },
  locationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Location' 
  },
  scenes: [sceneSchema]
});

export default mongoose.model('Panorama', panoramaSchema);