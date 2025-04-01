import { promises as fs } from "fs";
import path from "path";

const filePath = path.resolve("src/data/products.json");

export class ProductManager {
  constructor() {
    this.path = filePath;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((prod) => prod.id === id);
  }

  async addProduct(product) {
    const products = await this.getProducts();

    const newProduct = {
      id: Date.now().toString(),
      ...product,
    };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updatedFields,
      id: products[index].id,
    };

    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}
