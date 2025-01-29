import asyncHandler from "express-async-handler";
import slugify from "slugify";
import SubCategoryModel from "../models/SubCategory.model.js";
import { ApiError } from "../utils/apiError.js";
import CategoryModel from "../models/Category.model.js";

// @desc     Create SubCategory
// @route    POST /api/v1/subcategories
// @access   Private
const addSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.validData;

  // Check if category exists
  const checkCategory = await CategoryModel.findById(category);
  if (!checkCategory) {
    return next(
      new ApiError(`No category found for this ID: ${category}`, 400)
    );
  }
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

// @desc     Get all SubCategories with pagination
// @route    GET /api/v1/subcategories
// @access   Public
const getAllSubCategories = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const subcategories = await SubCategoryModel.find().skip(skip).limit(limit);

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
  const subCategoryId = req.params.id;
  const subCategory = await SubCategoryModel.findById(subCategoryId);
  if (!subCategory) {
    return next(
      new ApiError(`No subcategory found for this ID: ${subCategoryId}`, 404)
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
  const subCategoryId = req.params.id;
  const { name, category } = req.body;
  if (category) {
    // Check if category exists
    const checkCategory = await CategoryModel.findById(category);
    if (!checkCategory) {
      return next(
        new ApiError(`No category found for this ID: ${category}`, 400)
      );
    }
  }

  // Update sub-category
  const subCategory = await SubCategoryModel.findByIdAndUpdate(
    subCategoryId,
    { name, slug: slugify(name), category },
    { new: true, runValidators: true }
  );
  if (!subCategory) {
    return next(
      new ApiError(`No subcategory found for this ID: ${subCategoryId}`, 404)
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
  const subCategoryId = req.params.id;

  const subCategory = await SubCategoryModel.findByIdAndDelete(subCategoryId);

  if (!subCategory) {
    return next(
      new ApiError(`No subcategory found for this ID: ${subCategoryId}`, 404)
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
};
