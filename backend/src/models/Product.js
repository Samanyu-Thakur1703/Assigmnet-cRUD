import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
