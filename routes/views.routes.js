// routes/views.routes.js

import { Router } from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import url from 'url';

const router = Router();

// Vista de productos con paginación, filtros y orden
router.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === 'asc' ? { price: 1 } : req.query.sort === 'desc' ? { price: -1 } : {};
    const filter = req.query.query ? JSON.parse(req.query.query) : {};

    const options = {
      page,
      limit,
      sort,
      lean: true
    };

    const result = await Product.paginate(filter, options);

    // Construir links para paginación
    const baseUrl = url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: req.baseUrl + req.path
    });

    const makeLink = (p) =>
      `${baseUrl}?${new url.URLSearchParams({
        ...req.query,
        page: p
      }).toString()}`;

    res.render('home', {
      products: result.docs,
      pagination: {
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.hasPrevPage ? result.prevPage : null,
        nextPage: result.hasNextPage ? result.nextPage : null,
        prevLink: result.hasPrevPage ? makeLink(result.prevPage) : null,
        nextLink: result.hasNextPage ? makeLink(result.nextPage) : null
      },
      query: req.query.query || '',
      sort: req.query.sort || '',
      limit
    });

  } catch (error) {
    res.status(500).render('error', {
      message: 'Error al cargar productos',
      details: error.message
    });
  }
});

// Vista detalle de producto con botón para agregar al carrito
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).render('error', { message: 'Producto no encontrado' });
    }
    res.render('productDetail', { product });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Error al cargar producto',
      details: error.message
    });
  }
});

// Vista del carrito con productos populados
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate('products.product')
      .lean();

    if (!cart) {
      return res.status(404).render('error', { message: 'Carrito no encontrado' });
    }

    res.render('cart', { cart });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Error al cargar carrito',
      details: error.message
    });
  }
});

export default router;
