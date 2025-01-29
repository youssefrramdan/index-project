import express from "express";
import {
  addCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.controller.js";
import {
  createCategoryValidator,
  deleteCategoryValidator,
  getSpecificCategoryValidator,
  updateCategoryValidator,
} from "../utils/validators/categoryValidator.js";

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(getAllCategories)
  .post(createCategoryValidator, addCategory);
categoryRouter
  .route("/:id")
  .get(getSpecificCategoryValidator, getSpecificCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);
export default categoryRouter;

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
