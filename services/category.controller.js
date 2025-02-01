/* eslint-disable import/no-extraneous-dependencies */
import { v4 as uuid4 } from "uuid";
import sharp from "sharp";
import CategoryModel from "../models/Category.model.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlersFactory.js";
// eslint-disable-next-line import/order
import asyncHandler from "express-async-handler";
import uploadSingleImage from "../middlewares/uploadImageMiddleware.js";
import { ApiError } from "../utils/apiError.js";

// image processing
const resizeCategoryImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No image provided", 400));
  }
  const filename = `category-${uuid4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);
  //save image into database
  req.body.image = filename;
  next();
});

const uploadCategoryImage = uploadSingleImage("image");

// @desc     Create category
// @route    POST /api/v1/categories
// @access   Private

const addCategory = createOne(CategoryModel);

// @desc     Get list of categories
// @route    Get /api/v1/categories
// @access   Public

const getAllCategories = getAll(CategoryModel);

// @desc     Get Specific Category by id
// @route    GET /api/v1/categories/:id
// @access   Public

const getSpecificCategory = getOne(CategoryModel);

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
  uploadCategoryImage,
  resizeCategoryImage,
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

// import multer from "multer";
// import sharp from "sharp";

// ✅ Use Memory Storage because sharp processes images in memory
// const storage = multer.memoryStorage();

// ⚡ Multer setup using Memory Storage
// const upload = multer({
//     storage: storage, // ✅ Store files in memory instead of disk
//     fileFilter: fileFilter, // 🎯 Apply filtering to accept only images
// });

// 📌 Middleware to process the image using Sharp
// const processImage = async (req, res, next) => {
//     if (!req.file) return next(); // ✅ Skip processing if no file is uploaded

//     try {
// 🖼️ Process the image and convert it to JPEG
//         req.file.buffer = await sharp(req.file.buffer)
//             .resize(500, 500) // 🔄 Resize image to 500x500 pixels
//             .toFormat("jpeg") // 📷 Convert image to JPEG format
//             .jpeg({ quality: 80 }) // 🎚️ Set JPEG quality to 80%
//             .toBuffer(); // 🔄 Convert the processed image back to a Buffer

//         next(); // ✅ Proceed to the next middleware after processing
//     } catch (error) {
//         next(error); // ❌ Pass the error to the error-handling middleware
//     }
// };

// 📥 Middleware to upload and process a single image
// const uploadSingleImage = upload.single("image");

// export { uploadSingleImage, processImage };
