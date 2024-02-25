import { promises as fs} from "fs";
import { Product } from "./product.js";

export class ProductManager {
     constructor(path) {
          this.path = path;
     }

     async getProducts() {
          const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
          return products;
     }

     async getProductById(id) {
          const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
          return products.find((product) => product.id == id);
     }

     async addProduct(newProduct) {
          const { title, description, price, code, stock } = newProduct;
          const products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
          if (title && description && price && code && stock) {
               const index = products.findIndex((product) => product.code === code);
               if (index === -1) {
                    products.push(new Product(title, description, price, newProduct.thumbnail, code, stock));
                    await fs.writeFile(this.path, JSON.stringify(products));
                    return 200
               } else {
                    return 400
               }
          } else {
               return 400
          }
     }

     async modifyProduct(id, product) {
          const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
          const { title, description, price, thumbnail, code, stock } = product;

          if (title && description && price && thumbnail && code && stock) {
               const index = products.findIndex((p) => p.id === id);
               if (index !== -1) {
                    products[index] = { ...product, id };
                    await fs.writeFile(this.path, JSON.stringify(products, null, "\t"));
                    return 200;
               } else {
                    return 400;
               }
          } else {
               return 400;
          }
     }

     async deleteProduct(id) {
          const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
          const index = products.findIndex((product) => product.id === id);
          if (index !== -1) {
               const productsFiltered = products.filter((product) => product.id !== id);
               await fs.writeFile(this.path, JSON.stringify(productsFiltered));
               return 200
          } else {
               return 400
          }
     }
}