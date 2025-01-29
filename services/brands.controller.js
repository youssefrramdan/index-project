import slugify from "slugify";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import BrandModel from "../models/brand.model.js";

// @desc     Create brand
// @route    POST /api/v1/brands
// @access   Private
const addBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.validData;
  if (!name) {
    return next(new ApiError("Brand name is required", 400));
  }

  const brand = await BrandModel.create({ name, slug: slugify(name) });
  res.status(201).json({
    message: "Brand created successfully",
    data: brand,
  });
});

// @desc     Get list of brands
// @route    GET /api/v1/brands
// @access   Public
const getAllBrands = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const brands = await BrandModel.find().skip(skip).limit(limit);
  res.status(200).json({
    message: "Success",
    page,
    limit,
    result: brands.length,
    data: brands,
  });
});

// @desc     Get Specific brand by id
// @route    GET /api/v1/brands/:id
// @access   Public
const getSpecificBrand = asyncHandler(async (req, res, next) => {
  const brandId = req.validData.id;
  const brand = await BrandModel.findById(brandId);

  if (!brand) {
    return next(new ApiError(`No brand found with ID ${brandId}`, 404));
  }

  res.status(200).json({
    message: "Success",
    data: brand,
  });
});

// @desc     Update Specific brand by id
// @route    PUT /api/v1/brands/:id
// @access   Private
const updateBrand = asyncHandler(async (req, res, next) => {
  const brandId = req.validData.id;
  const { name } = req.body;
  if (!name) {
    return next(new ApiError("Brand name is required", 400));
  }

  const brand = await BrandModel.findByIdAndUpdate(
    { _id: brandId },
    { name, slug: slugify(name) },
    { new: true, runValidators: true }
  );

  if (!brand) {
    return next(new ApiError(`No brand found with ID ${brandId}`, 404));
  }

  res.status(200).json({
    message: "Brand updated successfully",
    data: brand,
  });
});

// @desc     Delete Specific brand by id
// @route    DELETE /api/v1/brands/:id
// @access   Private
const deleteBrand = asyncHandler(async (req, res, next) => {
  const brandId = req.validData.id;
  const brand = await BrandModel.findByIdAndDelete(brandId);

  if (!brand) {
    return next(new ApiError(`No brand found with ID ${brandId}`, 404));
  }

  res.status(200).json({ message: "Brand deleted successfully" });
});

export { addBrand, getAllBrands, getSpecificBrand, updateBrand, deleteBrand };
