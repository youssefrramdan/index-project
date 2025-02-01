import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import CategoryModel from "../../models/Category.model.js";

export const addSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 2 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("category")
    .customSanitizer((value, { req }) => value || req.params.categoryId)
    .notEmpty()
    .withMessage("Subcategory must belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((categoryId) =>
      CategoryModel.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category found for this id: ${categoryId}`)
          );
        }
      })
    ),

  validatorMiddleware,
];
export const getAllSubCategoryValidator = [
  check("categoryId")
    .isMongoId()
    .withMessage("Invalid SubCategory Id Format")
    .custom((value, { req }) => {
      req.filterObj = { category: req.params.categoryId };
    }),
  validatorMiddleware,
];
export const getSpecificSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  validatorMiddleware,
];

export const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  check("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((categoryId) =>
      CategoryModel.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),

  validatorMiddleware,
];

export const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  validatorMiddleware,
];
