import express from "express";
import {
  addBrand,
  deleteBrand,
  getAllBrands,
  getSpecificBrand,
  resizeBrandImage,
  updateBrand,
  uploadBrandImage,
} from "../services/brands.controller.js";
import {
  createBrandValidator,
  deleteBrandValidator,
  getSpecificBrandValidator,
  updateBrandValidator,
} from "../utils/validators/brandValidator.js";
import uploadSingleImageCloud from "../middlewares/uploadImageMiddlewareForCloudneriy.js";

const brandRouter = express.Router();
brandRouter.route("/").get(getAllBrands).post(uploadBrandImage,resizeBrandImage,createBrandValidator, addBrand);
brandRouter.route("/:id")
  .get(getSpecificBrandValidator, getSpecificBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);
export default brandRouter;
