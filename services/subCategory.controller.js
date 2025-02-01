import SubCategoryModel from "../models/SubCategory.model.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";

// @desc     Create SubCategory
// @route    POST /api/v1/subcategories
// @access   Private
const addSubCategory = createOne(SubCategoryModel)
// nested route
// Get /api/v1/categories/:category:id/subcategories

// @desc     Get all SubCategories with pagination
// @route    GET /api/v1/subcategories
// @access   Public
const getAllSubCategories = getAll(SubCategoryModel);

// @desc     Get specific SubCategory by ID
// @route    GET /api/v1/subcategories/:id
// @access   Public
const getSpecificSubCategory = getOne(SubCategoryModel)

// @desc     Update specific SubCategory by ID
// @route    PUT /api/v1/subcategories/:id
// @access   Private
const updateSubCategory = updateOne(SubCategoryModel);

// @desc     Delete specific SubCategory by ID
// @route    DELETE /api/v1/subcategories/:id
// @access   Private
const deleteSubCategory = deleteOne(SubCategoryModel);

export {
  addSubCategory,
  getAllSubCategories,
  getSpecificSubCategory,
  updateSubCategory,
  deleteSubCategory,
  // setCategoryIdToBody,
};

// // Middleware to validate category existence
// export const validateCategory = asyncHandler(async (req, res, next) => {
//   const checkCategory = await CategoryModel.findById(req.body.category);
//   if (!checkCategory) {
//     return next(
//       new ApiError(`No category found for this ID: ${req.body.category}`, 400)
//     );
//   }
//   next();
// });

// // nested route
// // Get /api/v1/categories/:category:id/subcategories
// // Middleware to set categoryId in the request body (if not provided)
// const setCategoryIdToBody = (req, res, next) => {
//   if (!req.body.category) req.body.category = req.params.categoryId;
//   next();
// };
