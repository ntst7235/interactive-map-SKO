import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  address: String,
  description: String,
  historicalContext: String,
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  icon: String,
  image: String,
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  eraId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Era', 
    required: true 
  },
  panoramaId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Panorama' 
  }
});

export default mongoose.model('Location', locationSchema);