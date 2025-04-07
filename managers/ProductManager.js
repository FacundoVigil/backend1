const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor() {
        this.filePath = path.join(__dirname, '../data/products.json'); 
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return []; 
        }
    }

    async addProduct(product) {
        const products = await this.getProducts();
        product.id = products.length ? products[products.length - 1].id + 1 : 1; 
        products.push(product);
        await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return product;
    }
}

module.exports = ProductManager;