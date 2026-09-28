import { validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const fieldErrors = {};

    for (const error of errors.array()) {
      if (!fieldErrors[error.path]) {
        fieldErrors[error.path] = error.msg;
      }
    }

    return res.status(400).json({
      message: "Validation failed.",
      errors: fieldErrors
    });
  }

  next();
};
