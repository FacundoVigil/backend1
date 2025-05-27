import express from 'express';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import passport from './config/passport.config.js';
import sessionRouter from './routes/sessions.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/aura';
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);


mongoose
  .connect(MONGO_URL)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));


app.engine('handlebars', engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());  

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionRouter);

// Socket.io
io.on('connection', socket => {
  console.log('🔌 Nuevo cliente conectado');
  socket.on('newMessage', msg => {
    io.emit('message', msg);
  });
  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado');
  });
});

// Levantar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
