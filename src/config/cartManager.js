import { promises as fs } from "fs";

export class CartManager {
  constructor(path) {
    this.products = path;
  }

  //Leer carrito
  async getCart() {
    const products = JSON.parse(await fs.readFile(this.products, "utf-8"));
    return products;
  }

  //Agregar un producto al carrito
  async addProductToCart(productID, quantity) {
    const cart = JSON.parse(await fs.readFile(this.products, "utf-8"));
    const product = cart.findIndex((p) => p.id === productID);
    if (product !== -1) {
      cart[product].quantity += quantity;
    } else {
      const newProduct = { id: productID, quantity: quantity };
      cart.push(newProduct);
    }
    await fs.writeFile(this.products, JSON.stringify(cart));
    return 200;
  }

  //SE AGREGARON A PARTE DE LO PEDIDO ESTOS 2 ENDPOINTS
  //Eliminar un producto del carrito
  async deleteProductFromCart(productID) {
    const cart = JSON.parse(await fs.readFile(this.products, "utf-8"));
    const index = cart.findIndex((product) => product.id === productID);
    if (index !== -1) {
      const productsFiltered = cart.filter(
        (product) => product.id !== productID
      );
      await fs.writeFile(this.products, JSON.stringify(productsFiltered));
      return 200;
    } else {
      return 400;
    }
  }

  //Vaciar carrito
  async deleteCart() {
    await fs.writeFile(this.products, JSON.stringify([]));
    return 200;
  }
}
