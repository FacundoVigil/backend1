const fs = require('fs');
const path = require('path');

class CartManager {
    constructor() {
        this.filePath = path.join(__dirname, '../data/carts.json'); // Ruta hacia el archivo JSON
    }


    async getCarts() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return []; 
        }
    }


    async createCart() {
        const carts = await this.getCarts();
        const newCart = { id: carts.length ? carts[carts.length - 1].id + 1 : 1, products: [] };
        carts.push(newCart);
        await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return newCart;
    }


    async addProductToCart(cartId, productId, quantity) {
        if (!quantity || quantity < 1) {
            return { error: "Cantidad inválida, debe ser mayor a 0" };
        }

        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) return { error: "Carrito no encontrado" };

        const productIndex = cart.products.findIndex(p => p.product === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity; // Suma la cantidad enviada en el body
        } else {
            cart.products.push({ product: productId, quantity }); // Agrega un nuevo producto con cantidad específica
        }

        await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return { success: "Producto agregado al carrito", cart };
    }
}

module.exports = CartManager;