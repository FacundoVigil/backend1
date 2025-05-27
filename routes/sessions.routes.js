import { Router } from 'express';
import passport from '../config/passport.config.js';
import { generateToken } from '../config/passport.config.js';

const router = Router();

/**
 * @route  
 * @desc    
 * @access  
 */
router.post(
    '/login',
    (req, res, next) => {
        passport.authenticate('login', { session: false }, (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({ status: 'error', message: info.message });
            }
            const token = generateToken(user);
            return res.json({ status: 'success', token });
        })(req, res, next);
    }
);

/**
 * @route   
 * @desc    
 * @access  
 */
router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { first_name, last_name, email, age, cart, role } = req.user;
        res.json({
            status: 'success',
            user: { first_name, last_name, email, age, cart, role }
        });
    }
);

export default router;
