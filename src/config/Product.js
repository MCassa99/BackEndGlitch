import crypto from "crypto";

export class Product {
     constructor(title, description, price, thumbnail, code, stock) {
          this.title = title;
          this.description = description;
          this.price = price;
          this.thumbnail = [];
          this.code = code;
          this.stock = stock;
          this.status = true;
          this.id = crypto.randomBytes(16).toString("hex");
     }
}