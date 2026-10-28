import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models.js';
import { requireAuth } from '../middleware.js';
const router = Router();
const makeToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 8)
      return res.status(400).json({ message: 'Name, email, and a password of at least 8 characters are required.' });
    const normalized = email.trim().toLowerCase();
    if (await User.findOne({ email: normalized })) return res.status(409).json({ message: 'Email is already registered.' });
    const user = await User.create({ name: name.trim(), email: normalized, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: makeToken(user), user: safeUser(user) });
  } catch (e) { next(e); }
});
router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: String(req.body.email || '').toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password)))
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    res.json({ token: makeToken(user), user: safeUser(user) });
  } catch (e) { next(e); }
});
router.get('/me', requireAuth, (req, res) => res.json({ user: safeUser(req.user) }));
export default router;
