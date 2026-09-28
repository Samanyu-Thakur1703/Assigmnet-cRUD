import Product from "../models/Product.js";

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({ message: "Product created.", product });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({ message: "Product updated.", product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({ message: "Product deleted." });
  } catch (error) {
    next(error);
  }
};
