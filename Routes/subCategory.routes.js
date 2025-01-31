import express from "express";
import {
  addSubCategory,
  createFilterObj,
  deleteSubCategory,
  getAllSubCategories,
  getSpecificSubCategory,
  // setCategoryIdToBody,
  updateSubCategory,
} from "../services/subCategory.controller.js";
import {
  addSubCategoryValidator,
  deleteSubCategoryValidator,
  getSpecificSubCategoryValidator,
  updateSubCategoryValidator,
} from "../utils/validators/subCategotyValidator.js";
// mergeParams : Allow us to access parameters on other Routers
const subCategoriesRouter = express.Router({ mergeParams: true });
// example : we need to access categoryId from category Router
subCategoriesRouter
  .route("/")
  .post(
    // setCategoryIdToBody,
    addSubCategoryValidator,
    addSubCategory
  )
  .get(createFilterObj, getAllSubCategories);
subCategoriesRouter
  .route("/:id")
  .get(getSpecificSubCategoryValidator, getSpecificSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

export default subCategoriesRouter;
