import express from "express";
import {
  addCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.controller.js";
const categoryRouter = express.Router();

categoryRouter.route("/").get(getAllCategories).post(addCategory);
categoryRouter
  .route("/:id")
  .get(getSpecificCategory)
  .put(updateCategory)
  .delete(deleteCategory);
export default categoryRouter;
