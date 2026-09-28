import { Router } from "express";
import { body, param } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { authenticate } from "../middleware/authenticate.js";
import { handleValidationErrors } from "../middleware/validation.js";

const router = Router();

const productBodyValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Product name is required.")
    .isLength({ min: 2, max: 120 }).withMessage("Name must be 2–120 characters."),
  body("description")
    .trim()
    .notEmpty().withMessage("Description is required.")
    .isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters."),
  body("price")
    .notEmpty().withMessage("Price is required.")
    .isFloat({ min: 0 }).withMessage("Price must be a number greater than or equal to 0.")
    .toFloat(),
  body("stock")
    .notEmpty().withMessage("Stock is required.")
    .isInt({ min: 0 }).withMessage("Stock must be a whole number greater than or equal to 0.")
    .toInt(),
  body("category")
    .trim()
    .notEmpty().withMessage("Category is required.")
    .isLength({ max: 80 }).withMessage("Category cannot exceed 80 characters."),
  body("imageUrl")
    .optional({ values: "falsy" })
    .isURL().withMessage("imageUrl must be a valid URL.")
];

const idValidation = [
  param("id").isMongoId().withMessage("Invalid product ID.")
];

router.post(
  "/",
  authenticate,
  productBodyValidation,
  handleValidationErrors,
  createProduct
);

router.get("/", getProducts);

router.get(
  "/:id",
  idValidation,
  handleValidationErrors,
  getProduct
);

router.put(
  "/:id",
  authenticate,
  idValidation,
  productBodyValidation,
  handleValidationErrors,
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  idValidation,
  handleValidationErrors,
  deleteProduct
);

export default router;
