import { getDao } from '../data/daoFactory.js';
const CartDao = getDao('cart');
export default class CartRepository {
    async create(data){ return CartDao.create(data); }
    async findById(id){ return CartDao.findById(id).lean(); }
    async addProduct(cartId, prod){ return CartDao.findByIdAndUpdate(cartId,{$push:{products:prod}}); }
}
