const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager();

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts(); // Obtener productos desde el backend
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar productos', details: error.message });
    }
});

// Nueva ruta para la vista `home.handlebars`
router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts(); // Obtener todos los productos
        res.render('home', { products }); // Renderizar la vista con los productos existentes
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar productos', details: error.message });
    }
});

module.exports = router;