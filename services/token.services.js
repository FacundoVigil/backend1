import jwt from 'jsonwebtoken';
const { JWT_SECRET } = process.env;
export const createResetToken = userId =>
    jwt.sign({ userId }, JWT_SECRET, { expiresIn:'1h' });
export const verifyResetToken = token =>
    jwt.verify(token, JWT_SECRET);
