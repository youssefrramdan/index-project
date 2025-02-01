import {check } from "express-validator";
import mongoose from "mongoose";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import CategoryModel from "../../models/Category.model.js";
import SubCategoryModel from "../../models/SubCategory.model.js";
import { ApiError } from "../apiError.js";

export const createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
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
  check("subcategories")
    .optional()
    .isArray()
    .withMessage("Subcategories should be an array")
    .custom(async (subcategoriesIds, { req }) => {
      // Validate each ID is a valid MongoDB ObjectId
      if (
        !subcategoriesIds.every((id) => mongoose.Types.ObjectId.isValid(id))
      ) {
        throw new ApiError("Invalid subcategory ID format", 404);
      }

      // Check if the subcategory IDs exist in the database
      const foundSubcategories = await SubCategoryModel.find({
        _id: { $in: subcategoriesIds },
      });

      if (foundSubcategories.length !== subcategoriesIds.length) {
        throw new Error("Invalid subcategories IDs");
      }

      // Ensure all subcategories belong to the given category
      const subcategoriesBelongToCategory = foundSubcategories.every(
        (sub) => sub.category.toString() === req.body.category
      );

      if (!subcategoriesBelongToCategory) {
        throw new Error(
          "Some subcategories do not belong to the specified category"
        );
      }
      return true;
    }),

  check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

export const getSpecificProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];

export const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
