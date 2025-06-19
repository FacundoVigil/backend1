import CartRepository from '../repositories/CartRepository.js';

const cartRepo = new CartRepository();

export default class CartManager {
    async createCart(data = {}) {
    return cartRepo.create(data);
    }

    async getCartById(id) {
    return cartRepo.findById(id);
    }

    async addProductToCart(cartId, product) {
    return cartRepo.addProduct(cartId, product);
    }
}
