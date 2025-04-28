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

    async updateProduct(id, updatedData) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(prod => prod.id === id);

            if (index !== -1) {
                products[index] = { ...products[index], ...updatedData };
                await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
                return { success: "Producto actualizado", product: products[index] };
            } else {
                return { error: "Producto no encontrado" };
            }
        } catch (error) {
            return { error: "Error al actualizar producto", details: error.message };
        }
    }


    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const filteredProducts = products.filter(prod => prod.id !== id);

            if (filteredProducts.length !== products.length) {
                await fs.promises.writeFile(this.filePath, JSON.stringify(filteredProducts, null, 2));
                return { success: "Producto eliminado" };
            } else {
                return { error: "Producto no encontrado" };
            }
        } catch (error) {
            return { error: "Error al eliminar producto", details: error.message };
        }
    }
}

module.exports = ProductManager;