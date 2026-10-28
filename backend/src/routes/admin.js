import { Router } from 'express';
import { Movie, Show } from '../models.js';
import { requireAuth, requireAdmin } from '../middleware.js';
const router = Router();
router.use(requireAuth, requireAdmin);
router.post('/movies', async (req, res, next) => {
  try {
    const { title, genre, language, duration, rating, year, poster, synopsis } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Movie title is required.' });
    const movie = await Movie.create({ title, genre, language, duration, rating, year, poster, synopsis });
    res.status(201).json({ movie });
  } catch (e) { next(e); }
});
router.post('/shows', async (req, res, next) => {
  try {
    const { movieId, theatre, location, startsAt, price } = req.body;
    if (!movieId || !theatre || !startsAt || Number(price) < 0 || !Number.isFinite(Number(price)))
      return res.status(400).json({ message: 'movieId, theatre, startsAt and a valid price are required.' });
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    const seats = Array.from({ length: 40 }, (_, i) => ({ label: `${String.fromCharCode(65 + Math.floor(i / 8))}${(i % 8) + 1}`, status: 'available' }));
    const show = await Show.create({ movie: movie._id, theatre, location, startsAt, price: Number(price), seats });
    res.status(201).json({ show });
  } catch (e) { next(e); }
});
export default router;
