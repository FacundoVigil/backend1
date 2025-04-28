const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');

const cartManager = new CartManager();


router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito', details: error.message });
    }
});


router.get('/:cid', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        const cart = carts.find(c => c.id == req.params.cid); 
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito', details: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Cantidad inválida, debe ser mayor a 0' });
        }

        const updatedCart = await cartManager.addProductToCart(
            Number(req.params.cid),
            Number(req.params.pid),
            quantity 
        );

        if (updatedCart.error) {
            return res.status(404).json(updatedCart); 
        }

        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito', details: error.message });
    }
});

module.exports = router;