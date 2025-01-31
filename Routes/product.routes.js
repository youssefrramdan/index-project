import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getSpecificProduct,
  updateProduct,
} from "../services/product.controller.js";
import {
  createProductValidator,
  deleteProductValidator,
  getSpecificProductValidator,
  updateProductValidator,
} from "../utils/validators/productValidator.js";

const productRouter = express.Router();
productRouter
  .route("/")
  .get(getAllProduct)
  .post(createProductValidator, createProduct);
productRouter
  .route("/:id")
  .get(getSpecificProductValidator, getSpecificProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);
export default productRouter;
