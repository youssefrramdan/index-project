/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prefer-const */
import ProductModel from "../models/product.model.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";

// @desc     Get all products
// @route    GET /api/v1/products
// @access   Public
const getAllProduct = getAll(ProductModel , "Product")

// @desc     Get specific product by id
// @param {String} id
// @route    GET /api/v1/products/:productId
// @access   Public
const getSpecificProduct = getOne(ProductModel);

// @desc     Create a new product
// @route    POST /api/v1/products
// @access   privite
const createProduct = createOne(ProductModel);

// @desc     Update an existing product
// @route    PUT /api/v1/products/:productId
// @access   Private
const updateProduct = updateOne(ProductModel);
// @desc     Delete an existing product
// @route    DELETE /api/v1/products/:productId
// @access   Private

const deleteProduct = deleteOne(ProductModel);
export {
  getAllProduct,
  getSpecificProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
