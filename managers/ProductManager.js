import ProductRepository from '../repositories/ProductRepository.js';

const prodRepo = new ProductRepository();

export default class ProductManager {
    async createProduct(data) {
    return prodRepo.create(data);
    }

    async getProducts(filter = {}, options = {}) {
    return prodRepo.findAll(filter, options);
    }

    async updateProduct(id, data) {
    return prodRepo.update(id, data);
    }

    async deleteProduct(id) {
    return prodRepo.delete(id);
    }
}
