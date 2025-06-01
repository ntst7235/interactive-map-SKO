import mongoose from 'mongoose';

const eraSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Каменный век', 'Бронзовый век', 'Железный век', 'Римская эпоха', 'Средневековье', 'Современность'],
    trim: true
  }
});

export default mongoose.model('Era', eraSchema);