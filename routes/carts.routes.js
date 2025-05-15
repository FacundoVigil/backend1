import { Router } from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = Router();

router.use(validateObjectId);

router.get('/', async (req, res) => {
  try {
    const carts = await Cart.find().populate('products.product');
    res.json({ status: 'success', payload: carts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    const product = await Product.findById(pid);

    if (!cart || !product) {
      return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });
    }

    const item = cart.products.find(p => p.product.equals(pid));
    if (item) {
      item.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    const populated = await cart.populate('products.product');
    res.json({ status: 'success', payload: populated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    cart.products = cart.products.filter(p => !p.product.equals(pid));
    await cart.save();
    const populated = await cart.populate('products.product');
    res.json({ status: 'success', payload: populated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    cart.products = products;
    await cart.save();
    const populated = await cart.populate('products.product');
    res.json({ status: 'success', payload: populated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ status: 'error', message: 'Cantidad inválida' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const item = cart.products.find(p => p.product.equals(pid));
    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Producto no está en el carrito' });
    }

    item.quantity = quantity;
    await cart.save();
    const populated = await cart.populate('products.product');
    res.json({ status: 'success', payload: populated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    cart.products = [];
    await cart.save();
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
