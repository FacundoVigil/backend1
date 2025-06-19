import { Router } from 'express';
import passport from '../config/passport.config.js';
import { generateToken } from '../config/passport.config.js';
import UserRepository from '../repositories/UserRepository.js';
import bcrypt from 'bcrypt';
import { createResetToken, verifyResetToken } from '../services/token.service.js';
import { sendResetEmail } from '../services/mail.service.js';

const router = Router();
const userRepo = new UserRepository();

router.post('/login', (req, res, next) => {
passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ status: 'error', message: info.message });
    const token = generateToken(user);
    res.json({ status: 'success', token });
    })(req, res, next);
});


router.get(
'/current',
passport.authenticate('jwt', { session: false }),
(req, res) => {
    const { first_name, last_name, email, age, role } = req.user;
    res.json({ status: 'success', user: { first_name, last_name, email, age, role } });
}
);

router.post('/forgot', async (req, res) => {
const { email } = req.body;
const user = await userRepo.findByEmail(email);
if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
const token = createResetToken(user._id);
await sendResetEmail(email, token);
res.json({ status: 'ok', message: 'Email de recuperación enviado' });
});

router.post('/reset', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
    const { userId } = verifyResetToken(token);
    const user = await userRepo.findById(userId);
    const same = bcrypt.compareSync(newPassword, user.password);
    if (same) return res.status(400).json({ error: 'La nueva contraseña debe ser diferente' });
    const hash = bcrypt.hashSync(newPassword, 10);
    await userRepo.updatePassword(userId, hash);
    res.json({ status: 'success', message: 'Contraseña actualizada' });
    } catch (err) {
    res.status(400).json({ error: 'Token inválido o expirado' });
    }
});

export default router;
