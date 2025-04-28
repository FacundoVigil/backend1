const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;


app.engine('handlebars', engine({
    extname: '.handlebars', 
    defaultLayout: false    
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());


const viewsRoutes = require('./routes/views.routes'); 
const cartsRoutes = require('./routes/carts.routes');
const productsRoutes = require('./routes/products.routes')(io);
app.use('/api/products', productsRoutes);
app.use('/', viewsRoutes);
app.use('/api/carts', cartsRoutes);

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('nuevoProducto', (producto) => {
        io.emit('actualizarLista', producto);
    });

    socket.on('eliminarProducto', (idProducto) => {
        io.emit('actualizarLista', idProducto);
    });
});


server.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});