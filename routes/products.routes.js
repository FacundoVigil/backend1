const express = require('express');
const ProductManager = require('../managers/ProductManager');

module.exports = (io) => {
    const router = express.Router();
    const productManager = new ProductManager();

    // Obtener todos los productos
    router.get('/', async (req, res) => {
        try {
            const products = await productManager.getProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los productos', details: error.message });
        }
    });

    // Obtener un producto por ID
    router.get('/:pid', async (req, res) => {
        try {
            const products = await productManager.getProducts();
            const product = products.find(p => p.id === Number(req.params.pid));
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el producto', details: error.message });
        }
    });

// Agregar un producto y emitir la lista actualizada
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        const updatedProducts = await productManager.getProducts(); // Obtener lista actualizada
        io.emit('actualizarListaCompleta', updatedProducts); // Emitir evento con la lista completa
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto', details: error.message });
    }
});

    // Actualizar un producto
    router.put('/:pid', async (req, res) => {
        try {
            const updatedProduct = await productManager.updateProduct(Number(req.params.pid), req.body);
            if (updatedProduct.error) {
                return res.status(404).json(updatedProduct);
            }
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
        }
    });


// Eliminar un producto y emitir la lista actualizada
router.delete('/:pid', async (req, res) => {
    try {
        const result = await productManager.deleteProduct(Number(req.params.pid));
        if (result.error) {
            return res.status(404).json(result);
        }
        const updatedProducts = await productManager.getProducts(); // Obtener lista actualizada
        io.emit('actualizarListaCompleta', updatedProducts); // Emitir evento con la lista completa
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
    }
});

    return router;
};