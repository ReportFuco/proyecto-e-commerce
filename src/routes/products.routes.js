import { Router } from "express";
import { ProductManager } from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await manager.getProductById(pid);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(product);
});

router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  if (!title || !description || !code || !price || stock == null || !category) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const newProduct = await manager.addProduct({
    title,
    description,
    code,
    price,
    status: status !== undefined ? status : true,
    stock,
    category,
    thumbnails: thumbnails || [],
  });

  res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updated = await manager.updateProduct(pid, req.body);

  if (!updated) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(updated);
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  await manager.deleteProduct(pid);
  res.json({ message: "Producto eliminado" });
});

export default router;
