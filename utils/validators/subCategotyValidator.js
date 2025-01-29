import { check } from "express-validator";
import validatorMiddleware  from "../../middlewares/validatorMiddleware.js";

export const addSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 2 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name"),
    check("category")
    .notEmpty()
    .withMessage("Category required")
    .isMongoId()
    .withMessage("Invalid Category Id Format"),
  validatorMiddleware,
];

export const getSpecificSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  validatorMiddleware,
];

export const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  validatorMiddleware,
];

export const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  validatorMiddleware,
];
