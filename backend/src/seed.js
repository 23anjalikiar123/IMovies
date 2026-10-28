import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Movie, Show } from './models.js';

const main = async () => {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) throw new Error('Configure backend/.env first.');
  await mongoose.connect(process.env.MONGODB_URI);
  const adminEmail = 'admin@imovies.local';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) admin = await User.create({
    name: 'IMovies Admin', email: adminEmail,
    password: await bcrypt.hash('Admin123!', 12), role: 'admin'
  });
  if (await Movie.countDocuments() === 0) {
    const movies = await Movie.insertMany([
      { title: 'Midnight Run', genre: 'Action', language: 'English', duration: '2h 08m', rating: 8.1, year: 2025, synopsis: 'A courier has one night to deliver a mysterious package across a neon-lit city.' },
      { title: 'The Last Monsoon', genre: 'Drama', language: 'Hindi', duration: '2h 15m', rating: 8.4, year: 2025, synopsis: 'A family reunites in their hometown as the first monsoon rain arrives.' },
      { title: 'Orbit 9', genre: 'Sci-Fi', language: 'English', duration: '1h 58m', rating: 7.9, year: 2026, synopsis: 'A stranded crew discovers an unexpected signal beyond the edge of known space.' },
      { title: 'Laughing Matters', genre: 'Comedy', language: 'Hindi', duration: '1h 52m', rating: 7.6, year: 2024, synopsis: 'An aspiring comic finds that the best material comes from everyday chaos.' },
      { title: 'Blue Lantern', genre: 'Thriller', language: 'English', duration: '2h 03m', rating: 8.0, year: 2026, synopsis: 'A small-town journalist follows a clue that everyone else wants buried.' }
    ]);
    const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
    for (const [idx, movie] of movies.entries()) {
      for (let slot = 0; slot < 2; slot++) {
        const startsAt = new Date(start.getTime() + (idx * 2 + slot) * 2 * 60 * 60 * 1000);
        const seats = Array.from({ length: 40 }, (_, i) => ({ label: `${String.fromCharCode(65 + Math.floor(i / 8))}${(i % 8) + 1}`, status: 'available' }));
        await Show.create({ movie: movie._id, theatre: slot ? 'Screen 2 · IMovies Central' : 'Screen 1 · IMovies Central', location: 'City Centre', startsAt, price: 220 + idx * 20, seats });
      }
    }
  }
  console.log('Seed complete. Admin:', adminEmail, '/ Admin123!');
  await mongoose.disconnect();
};
main().catch(async e => { console.error(e); await mongoose.disconnect(); process.exit(1); });
