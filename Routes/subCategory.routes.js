import express from "express";
import {
  addSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSpecificSubCategory,
  updateSubCategory,
} from "../services/subCategory.controller.js";
import {
  addSubCategoryValidator,
  deleteSubCategoryValidator,
  getSpecificSubCategoryValidator,
  updateSubCategoryValidator,
} from "../utils/validators/subCategotyValidator.js";

const subCategoriesRouter = express.Router();

subCategoriesRouter
  .route("/")
  .post(addSubCategoryValidator, addSubCategory)
  .get(getAllSubCategories);
subCategoriesRouter
  .route("/:id")
  .get(getSpecificSubCategoryValidator, getSpecificSubCategory)
  .put(updateSubCategoryValidator,updateSubCategory)
  .delete(deleteSubCategoryValidator,deleteSubCategory);

export default subCategoriesRouter;
