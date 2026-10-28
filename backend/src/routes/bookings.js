import { Router } from 'express';
import mongoose from 'mongoose';
import { Booking, Show } from '../models.js';
import { requireAuth } from '../middleware.js';
const router = Router();
router.use(requireAuth);

router.post('/', async (req, res, next) => {
  try {
    const { showId, seats } = req.body;
    if (!mongoose.isValidObjectId(showId) || !Array.isArray(seats) || seats.length < 1 || seats.length > 10)
      return res.status(400).json({ message: 'Choose a show and between 1 and 10 seats.' });
    const uniqueSeats = [...new Set(seats.map(String))];
    if (uniqueSeats.length !== seats.length) return res.status(400).json({ message: 'Duplicate seats are not allowed.' });
    const show = await Show.findById(showId).populate('movie');
    if (!show) return res.status(404).json({ message: 'Showtime not found.' });
    if (new Date(show.startsAt) <= new Date()) return res.status(400).json({ message: 'This show has already started.' });
    const found = uniqueSeats.map(label => show.seats.find(s => s.label === label));
    if (found.some(s => !s)) return res.status(400).json({ message: 'One or more seat labels are invalid.' });
    if (found.some(s => s.status !== 'available')) return res.status(409).json({ message: 'One or more seats were just booked. Please choose again.' });
    // Conditional update prevents ordinary concurrent requests from reserving already-booked seats.
    const updated = await Show.updateOne(
      { _id: show._id, seats: { $all: uniqueSeats.map(label => ({ $elemMatch: { label, status: 'available' } })) } },
      { $set: Object.fromEntries(uniqueSeats.map(label => [`seats.$[seat${uniqueSeats.indexOf(label)}].status`, 'booked'])) },
      { arrayFilters: uniqueSeats.map((label, i) => ({ [`seat${i}.label`]: label, [`seat${i}.status`]: 'available' })) }
    );
    // Re-check after update; if the conditional update did not match, do not create a booking.
    if (!updated.modifiedCount) return res.status(409).json({ message: 'Seats are no longer available. Refresh and try again.' });
    const booking = await Booking.create({
      user: req.user._id, show: show._id, movieTitle: show.movie.title, theatre: show.theatre,
      startsAt: show.startsAt, seats: uniqueSeats, total: uniqueSeats.length * show.price
    });
    res.status(201).json({ booking });
  } catch (e) { next(e); }
});
router.get('/my', async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (e) { next(e); }
});
router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    if (booking.status === 'cancelled') return res.status(400).json({ message: 'Booking is already cancelled.' });
    if (new Date(booking.startsAt) <= new Date()) return res.status(400).json({ message: 'Past shows cannot be cancelled.' });
    const show = await Show.findById(booking.show);
    if (show) booking.seats.forEach(label => { const seat = show.seats.find(s => s.label === label); if (seat) seat.status = 'available'; });
    if (show) await show.save();
    booking.status = 'cancelled';
    await booking.save();
    res.json({ booking });
  } catch (e) { next(e); }
});
export default router;
