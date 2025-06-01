import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Поселения', 'Захоронения', 'Артефакты', 'Крепости', 'Религиозные', 'Остальное'],
    trim: true
  }
});

export default mongoose.model('Category', categorySchema);