import asyncHandler from "express-async-handler";
import slugify from "slugify";
import SubCategoryModel from "../models/SubCategory.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiFeatures from "../utils/DummyData/apiFeatures.js";

// @desc     Create SubCategory
// @route    POST /api/v1/subcategories
// @access   Private
const addSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });

  res.status(201).json({
    message: "SubCategory created successfully",
    data: subCategory,
  });
});
// nested route
// Get /api/v1/categories/:category:id/subcategories
export const createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc     Get all SubCategories with pagination
// @route    GET /api/v1/subcategories
// @access   Public
const getAllSubCategories = asyncHandler(async (req, res) => {
  const documentCount = await SubCategoryModel.countDocuments();
  const Features = new ApiFeatures(
    SubCategoryModel.find(req.filterObj),
    req.query
  )
    .filter()
    .search("SubCategory")
    .sort()
    .limitFields()
    .paginate(documentCount);
  const { paginationResult, mongooseQuery } = Features;
  const subcategories = await mongooseQuery;
  res.status(200).json({
    message: "Success",
    paginationResult,
    result: subcategories.length,
    data: subcategories,
  });
});

// @desc     Get specific SubCategory by ID
// @route    GET /api/v1/subcategories/:id
// @access   Public
const getSpecificSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategoryModel.findById(req.params.id);
  if (!subCategory) {
    return next(
      new ApiError(`No subcategory found for this ID: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    message: "Success",
    data: subCategory,
  });
});

// @desc     Update specific SubCategory by ID
// @route    PUT /api/v1/subcategories/:id
// @access   Private
const updateSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategoryModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: slugify(req.body.name),
      category: req.body.category,
    },
    { new: true, runValidators: true }
  );

  if (!subCategory) {
    return next(
      new ApiError(`No subcategory found for this ID: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    message: "Subcategory updated successfully",
    data: subCategory,
  });
});

// @desc     Delete specific SubCategory by ID
// @route    DELETE /api/v1/subcategories/:id
// @access   Private
const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategoryModel.findByIdAndDelete(req.params.id);
  if (!subCategory) {
    return next(
      new ApiError(`No subcategory found for this ID: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    message: "Subcategory deleted successfully",
  });
});

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
