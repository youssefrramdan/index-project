import slugify from "slugify";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import CategoryModel from "../models/Category.model.js";

// @desc     Create category
// @route    POST /api/v1/categories
// @access   Private

const addCategory = asyncHandler(async (req, res, next) => {
  const {name} = req.validData;
  if (!name) {
    return next(new ApiError("Category name is required", 404));
  }
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  // for follfilled (success)
  res.status(201).json({
    message: "Category created successfully",
    data: category,
  });
});

// @desc     Get list of categories
// @route    Get /api/v1/categories
// @access   Public

const getAllCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find().skip(skip).limit(limit);
  res.status(200).json({
    message: "success",
    page: page,
    result: categories.length,
    data: categories,
  });
});

// @desc     Get Specific Category by id
// @route    GET /api/v1/categories/:id
// @access   Public

const getSpecificCategory = asyncHandler(async (req, res, next) => {
  const Categoryid = req.validData.id;
  const category = await CategoryModel.findById(Categoryid);
  if (!category) {
    return next(new ApiError(`No category for this id ${Categoryid}`, 404));
  }
  res.status(200).json({
    message: "success",
    data: category,
  });
});

// @desc     Update Specific Category By id
// @route    PUT /api/v1/categories/id
// @access   Private

const updateCategory = asyncHandler(async (req, res, next) => {
  const Categoryid = req.validData.id;
  const { name } = req.validData;

  const category = await CategoryModel.findByIdAndUpdate(
    { _id: Categoryid },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new ApiError(`No category for this id ${Categoryid}`, 404));
  }
  res.status(200).json({
    message: "Category Updated Successfully",
    data: category,
  });
});

// @desc     Delete Specific Category By id
// @route    DELETE /api/v1/categories/id
// @access   Private
const deleteCategory = asyncHandler(async (req, res, next) => {
  const Categoryid = req.validData.id;
  const category = await CategoryModel.findByIdAndDelete(Categoryid);
  if (!category) {
    return next(new ApiError(`No category for this id ${Categoryid}`, 404));
  }
  res.status(200).json({ message: "Category Deleted Successfully" });
});

export {
  addCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
  deleteCategory,
};

//  ! express-async-handler
// Simple middleware for handling exceptions
//  inside of async express routes and passing them to your express error handlers.
// only wrap async function into async handler for catch execptions

// ? Without express-async-handler
// express.get('/',(req, res, next) => {
//     foo.findAll()
//     .then ( bar => {
//        res.send(bar)
//      } )
//     .catch(next); // error passed on to the error handling route
// })

// ------------------------------------------------------------
//? with create method with async - await
// export const addCategory = async (req, res) => {
//   try {

//     const name = req.body.name;
//     const category = await CategoryModel.create({ name, slug: slugify(name) });
//     res.status(201).json({
//       message: "Category created successfully",
//       data: category,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//     //next(error);
//   }
// };
// ---------------------------------------------------------------------------------------------

// ? with save method

// const newCategory = new CategoryModel({ name });
//   newCategory
//     .save()
//     .then((category) => {
//       res.json(category);
//     })
//     .catch((err) => {
//       res.json(err);
//     })

// -----------------------------------------------------------------------------------------------
// pagination
// const { id } = req.params;
//          Or
// const Categoryid = req.params.id;
// req.query.page is used in Express.js to access the value of a query parameter sent in the URL.
// It's particularly useful when implementing pagination to divide data into pages.

// --------------------------------------------------------------------------------------------------------
