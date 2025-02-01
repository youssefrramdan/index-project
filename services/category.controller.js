import CategoryModel from "../models/Category.model.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";

// @desc     Create category
// @route    POST /api/v1/categories
// @access   Private

const addCategory = createOne(CategoryModel);

// @desc     Get list of categories
// @route    Get /api/v1/categories
// @access   Public

const getAllCategories = getAll(CategoryModel)

// @desc     Get Specific Category by id
// @route    GET /api/v1/categories/:id
// @access   Public

const getSpecificCategory = getOne(CategoryModel)

// @desc     Update Specific Category By id
// @route    PUT /api/v1/categories/id
// @access   Private

const updateCategory = updateOne(CategoryModel);

// @desc     Delete Specific Category By id
// @route    DELETE /api/v1/categories/id
// @access   Private
const deleteCategory = deleteOne(CategoryModel);

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
