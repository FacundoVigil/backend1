const express = require('express');
const app = express();
const port = 8080;


const productsRoutes = require('./routes/products.routes');
const cartsRoutes = require('./routes/carts.routes');


app.use(express.json());


app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});