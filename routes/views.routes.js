const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager();


router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts(); 
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar productos', details: error.message });
    }
});


router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products }); 
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar productos', details: error.message });
    }
});

module.exports = router;