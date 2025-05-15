// routes/index.routes.js

import { Router } from 'express';
import productsRouter from './products.routes.js';
import cartsRouter    from './carts.routes.js';

const router = Router();

// Ruta raíz: redirige a /products
router.get('/', (req, res) => {
  res.redirect('/products');
});

// Enlazamos sub-routers
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);

export default router;
