import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
// @desc array of rules for

export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name"),
  validatorMiddleware,
];
// dry => dont repeat your self
export const getSpecificCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddleware,
];
export const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddleware,
];

export const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddleware,
];
