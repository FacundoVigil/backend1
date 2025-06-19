import dotenv from 'dotenv';
dotenv.config();
const required = ['PORT','MONGO_URL','JWT_SECRET','EMAIL_HOST','EMAIL_PORT','EMAIL_USER','EMAIL_PASS','FRONTEND_URL'];
required.forEach(key => {
if (!process.env[key]) throw new Error(`Env ${key} is required`);
});
export default true;
