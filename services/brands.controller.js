import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import BrandModel from "../models/brand.model.js";
import ApiFeatures from "../utils/DummyData/apiFeatures.js";
import { createOne, deleteOne, updateOne } from "./handlersFactory.js";

// @desc     Create brand
// @route    POST /api/v1/brands
// @access   Private
const addBrand = createOne(BrandModel);

// @desc     Get list of brands
// @route    GET /api/v1/brands
// @access   Public
const getAllBrands = asyncHandler(async (req, res) => {
  const documentCount = await BrandModel.countDocuments();
  const Features = new ApiFeatures(BrandModel.find(), req.query)
    .filter()
    .search("Brands")
    .sort()
    .limitFields()
    .paginate(documentCount);

  const { mongooseQuery, paginationResult } = Features;
  const result = await mongooseQuery;

  res.status(200).json({
    message: "Success",
    paginationResult,
    result: result.length,
    data: result,
  });
});

// @desc     Get Specific brand by id
// @route    GET /api/v1/brands/:id
// @access   Public
const getSpecificBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.validData;
  if (!id) {
    return next(new ApiError("Brand ID is required", 400));
  }

  const brand = await BrandModel.findById(id);
  if (!brand) {
    return next(new ApiError(`No brand found with ID ${id}`, 404));
  }

  res.status(200).json({
    message: "Success",
    data: brand,
  });
});

// @desc     Update Specific brand by id
// @route    PUT /api/v1/brands/:id
// @access   Private
const updateBrand = updateOne(BrandModel);
// @desc     Delete Specific brand by id
// @route    DELETE /api/v1/brands/:id
// @access   Private
const deleteBrand = deleteOne(BrandModel);

export { addBrand, getAllBrands, getSpecificBrand, updateBrand, deleteBrand };
