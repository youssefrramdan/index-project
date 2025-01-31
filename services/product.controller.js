/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prefer-const */
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import ProductModel from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiFeatures from "../utils/DummyData/apiFeatures.js";

// @desc     Get all products
// @route    GET /api/v1/products
// @access   Public
const getAllProduct = asyncHandler(async (req, res) => {
  const documentCount = await ProductModel.countDocuments()
  const features = new ApiFeatures(ProductModel.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(documentCount);
  const { mongooseQuery, paginationResult } = features;

  const products = await mongooseQuery;
  // Response
  res.status(200).json({
    message: "success",
    paginationResult,
    result: products.length,
    data: products,
  });
});

// @desc     Get specific product by id
// @param {String} id
// @route    GET /api/v1/products/:productId
// @access   Public
const getSpecificProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const product = await ProductModel.findById(productId).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    return next(new ApiError(`No product found with ID: ${productId}`, 404));
  }
  res.status(200).json({
    message: "success",
    data: product,
  });
});

// @desc     Create a new product
// @route    POST /api/v1/products
// @access   privite
const createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  const product = await ProductModel.create(req.body);
  res.status(200).json({
    message: "success",
    data: product,
  });
});

// @desc     Update an existing product
// @route    PUT /api/v1/products/:productId
// @access   Private
const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new ApiError(`No product found with ID: ${id}`, 404));
  }
  res.status(200).json({
    message: "success",
    data: product,
  });
});

// @desc     Delete an existing product
// @route    DELETE /api/v1/products/:productId
// @access   Private

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndDelete({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new ApiError(`No product found with ID: ${id}`, 404));
  }
  res.status(200).json({
    message: "success",
    data: product,
  });
});
export {
  getAllProduct,
  getSpecificProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
