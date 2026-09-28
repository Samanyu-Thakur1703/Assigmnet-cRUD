import { Router } from "express";
import { body } from "express-validator";
import {
  login,
  logout,
  me,
  refreshToken,
  register
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import { handleValidationErrors } from "../middleware/validation.js";

const router = Router();

const registerValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required.")
    .isLength({ min: 2, max: 80 }).withMessage("Name must be 2–80 characters."),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Enter a valid email address.")
    .normalizeEmail(),
  body("password")
    .isString().withMessage("Password must be a string.")
    .isLength({ min: 8, max: 72 }).withMessage("Password must be 8–72 characters."),
  body("confirmPassword")
    .isString().withMessage("Confirm password is required.")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match.")
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Enter a valid email address.")
    .normalizeEmail(),
  body("password")
    .isString().withMessage("Password is required.")
    .notEmpty().withMessage("Password is required.")
];

router.post("/register", registerValidation, handleValidationErrors, register);
router.post("/login", loginValidation, handleValidationErrors, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;
