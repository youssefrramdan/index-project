import express from "express";
// eslint-disable-next-line import/no-extraneous-dependencies
import subCategoriesRouter from "./subCategory.routes.js";
import {
  addCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
} from "../services/category.controller.js";
import {
  createCategoryValidator,
  deleteCategoryValidator,
  getSpecificCategoryValidator,
  updateCategoryValidator,
} from "../utils/validators/categoryValidator.js";


const categoryRouter = express.Router();
categoryRouter.use("/:categoryId/subcategories", subCategoriesRouter);
categoryRouter
  .route("/")
  .get(getAllCategories)
  .post(uploadCategoryImage, resizeCategoryImage, createCategoryValidator, addCategory);
categoryRouter
  .route("/:id")
  .get(getSpecificCategoryValidator, getSpecificCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);
export default categoryRouter;

 // upload.single("image"),
    // (req, res, next) => {
    //   console.log(req.file);
    //   next();
    // },
// -----------------------------------------------------------
// .get(
//   // 1- rules
//   param("id").isMongoId().withMessage("invalid category id"),
//   // 2- middle ware => catch errors from rules if exist
//   (req, res, next) => {
//     const errors = validationResult(req);
//     // finds the validation errors in this request and wraps them in an object with handy functions
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   },
//   getSpecificCategory
// )
