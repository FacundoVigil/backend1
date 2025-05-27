import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';


passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',    
            passwordField: 'password',
            session: false
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }

                const isValid = await user.comparePassword(password);
                if (!isValid) {
                    return done(null, false, { message: 'Contraseña incorrecta' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (err) {
                return done(err);
            }
        }
    )
);


passport.use(
    'jwt',
    new JWTStrategy(
        {
            secretOrKey: JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async (tokenPayload, done) => {
            try {
                // tokenPayload contiene el payload que firmamos (p.ej. user._id, email, role)
                const user = await User.findById(tokenPayload.userId).lean();
                if (!user) {
                    return done(null, false, { message: 'Usuario no existe' });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);


export const generateToken = (user) => {
    
    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1h'  
    });
};

export default passport;
