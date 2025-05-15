// routes/products.routes.js

import { Router } from 'express';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import url from 'url';

const router = Router();

/**
 * GET /products
 * Query params:
 *  - limit: número de items por página (default 10)
 *  - page: número de página (default 1)
 *  - sort: 'asc' o 'desc' para ordenar por price
 *  - query: JSON string con filtro (e.g. {"category":"remeras"} o {"stock": {"$gt": 0}})
 */
router.get('/', async (req, res) => {
  try {
    // Parseo de parámetros
    const limit = parseInt(req.query.limit) || 10;
    const page  = parseInt(req.query.page)  || 1;
    const sort  = req.query.sort === 'asc'
                ? { price: 1 }
                : req.query.sort === 'desc'
                ? { price: -1 }
                : {};
    const filter = req.query.query
      ? JSON.parse(req.query.query)
      : {};

    // Opciones de paginación
    const options = {
      page,
      limit,
      sort,
      lean: true
    };

    // Ejecutar paginación
    const result = await Product.paginate(filter, options);

    // Construir URL base para links
    const fullUrl = url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: req.baseUrl + req.path
    });

    const makeLink = (p) =>
      `${fullUrl}?${new url.URLSearchParams({ 
        ...req.query, 
        page: p 
      }).toString()}`;

    // Respuesta
    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? makeLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? makeLink(result.nextPage) : null
    });
  } catch (error) {
    console.error('Error en GET /products:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /products/:pid - obtener producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /products - crear nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /products/:pid - actualizar producto
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true, runValidators: true });
    if (!updatedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE /products/:pid - eliminar producto
router.delete('/:pid', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
