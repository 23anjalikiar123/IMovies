import { Router } from 'express';
import mongoose from 'mongoose';
import { Show } from '../models.js';
const router = Router();
router.get('/shows', async (req, res, next) => {
  try {
    const filter = { startsAt: { $gte: new Date() } };
    if (req.query.movieId && mongoose.isValidObjectId(req.query.movieId)) filter.movie = req.query.movieId;
    const shows = await Show.find(filter).populate('movie').sort({ startsAt: 1 }).limit(100);
    res.json({ shows });
  } catch (e) { next(e); }
});
router.get('/shows/:id/seats', async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id).select('seats price theatre startsAt');
    if (!show) return res.status(404).json({ message: 'Showtime not found.' });
    res.json({ seats: show.seats, price: show.price, theatre: show.theatre, startsAt: show.startsAt });
  } catch (e) { next(e); }
});
export default router;
