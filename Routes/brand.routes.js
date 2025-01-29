import express from "express";
import {
  addBrand,
  deleteBrand,
  getAllBrands,
  getSpecificBrand,
  updateBrand,
} from "../services/brands.controller.js";
import {
  createBrandValidator,
  deleteBrandValidator,
  getSpecificBrandValidator,
  updateBrandValidator,
} from "../utils/validators/brandValidator.js";

const brandRouter = express.Router();
brandRouter.route("/").get(getAllBrands).post(createBrandValidator, addBrand);
brandRouter.route("/:id")
  .get(getSpecificBrandValidator, getSpecificBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);
export default brandRouter;
