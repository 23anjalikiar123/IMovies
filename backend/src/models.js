import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  genre: { type: String, default: 'Drama' },
  language: { type: String, default: 'English' },
  duration: { type: String, default: '2h 00m' },
  rating: { type: Number, min: 0, max: 10, default: 8 },
  year: { type: Number, default: new Date().getFullYear() },
  poster: { type: String, default: '' },
  synopsis: { type: String, default: 'A cinematic experience awaits.' }
}, { timestamps: true });

const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatre: { type: String, required: true },
  location: { type: String, default: 'City Centre' },
  startsAt: { type: Date, required: true },
  price: { type: Number, min: 0, required: true },
  seats: [{ label: String, status: { type: String, enum: ['available', 'booked'], default: 'available' } }]
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  movieTitle: { type: String, required: true },
  theatre: { type: String, required: true },
  startsAt: { type: Date, required: true },
  seats: [{ type: String, required: true }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Movie = mongoose.model('Movie', movieSchema);
export const Show = mongoose.model('Show', showSchema);
export const Booking = mongoose.model('Booking', bookingSchema);
