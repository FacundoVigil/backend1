import User from '../models/User.model.js';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';

export function getDao(name) {
    switch(name) {
    case 'user':    return User;
    case 'cart':    return Cart;
    case 'product': return Product;
    default:        throw new Error('Unknown DAO');
}
}
