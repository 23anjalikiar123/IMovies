import { Router } from 'express';
import { Movie } from '../models.js';
const router = Router();
router.get('/movies', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.q) filter.title = { $regex: String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    if (req.query.genre && req.query.genre !== 'All') filter.genre = req.query.genre;
    const movies = await Movie.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ movies });
  } catch (e) { next(e); }
});
router.get('/movies/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    res.json({ movie });
  } catch (e) { next(e); }
});
export default router;
