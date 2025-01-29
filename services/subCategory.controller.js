import asyncHandler from "express-async-handler";
import slugify from "slugify";
import SubCategoryModel from "../models/SubCategory.model.js";
import { ApiError } from "../utils/apiError.js";
import CategoryModel from "../models/Category.model.js";

// nested route
// Get /api/v1/categories/:category:id/subcategories
// Middleware to set categoryId in the request body (if not provided)
const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Middleware to validate category existence
export const validateCategory = asyncHandler(async (req, res, next) => {
  const checkCategory = await CategoryModel.findById(req.body.category);
  if (!checkCategory) {
    return next(
      new ApiError(`No category found for this ID: ${req.body.category}`, 400)
    );
  }
  next();
});

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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const subcategories = await SubCategoryModel.find(req.filterObj)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "category",
      select: "name",
    });

  res.status(200).json({
    message: "Success",
    page,
    limit,
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
  if (req.body.category) {
    await validateCategory(req, res, next);
  }

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
  setCategoryIdToBody,
};
