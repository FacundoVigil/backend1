const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});


router.get('/:pid', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const product = products.find(p => p.id == req.params.pid); 
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});


router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body); 
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});


router.put('/:pid', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const index = products.findIndex(p => p.id == req.params.pid);
        if (index === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        products[index] = { ...products[index], ...req.body, id: products[index].id };
        await productManager.updateProducts(products); 
        res.json(products[index]);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});


router.delete('/:pid', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const newProducts = products.filter(p => p.id != req.params.pid);
        if (products.length === newProducts.length) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        await productManager.updateProducts(newProducts); 
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;