import { Router } from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import url from 'url';

const router = Router();

router.get('/products', async (req, res) => {
  try {

    let cart = await Cart.findOne();
    if (!cart) {
      cart = await Cart.create({ products: [] });
    }
    const cartId = cart._id.toString();

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

    const options = { page, limit, sort, lean: true };
    const result  = await Product.paginate(filter, options);

    const baseUrl = url.format({
      protocol: req.protocol,
      host:     req.get('host'),
      pathname: req.baseUrl + req.path
    });
    const makeLink = (p) =>
      `${baseUrl}?${new url.URLSearchParams({ ...req.query, page: p })}`;

    res.render('home', {
      products:    result.docs,
      page:        result.page,
      totalPages:  result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage:    result.prevPage,
      nextPage:    result.nextPage,
      prevLink:    result.hasPrevPage ? makeLink(result.prevPage) : null,
      nextLink:    result.hasNextPage ? makeLink(result.nextPage) : null,
      cartId      
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Error al cargar productos',
      details: error.message
    });
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).render('error', { message: 'Producto no encontrado' });
    }


    const cartId = req.query.cid || '';

    res.render('productDetail', { product, cartId });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Error al cargar producto',
      details: error.message
    });
  }
});

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

