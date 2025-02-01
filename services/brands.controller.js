import { v4 as uuid4 } from "uuid";
import sharp from "sharp";
import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import BrandModel from "../models/brand.model.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlersFactory.js";
import uploadSingleImage from "../middlewares/uploadImageMiddleware.js";

const resizeBrandImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No image provided", 400));
  }

  const filename = `brand-${uuid4()}-${Date.now()}.jpeg`;

  const processedImage = await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();

  const stream = cloudinary.uploader.upload_stream(
    { folder: "brands", public_id: filename },
    (error, result) => {
      if (error) {
        return next(new ApiError("Failed to upload to Cloudinary", 500));
      }
      req.body.image = result.secure_url;
      next();
    }
  );

  Readable.from(processedImage).pipe(stream);
});
const uploadBrandImage = uploadSingleImage("image", "brands");

// const uploadBrandImage = uploadSingleImage("image");

// @desc     Create brand
// @route    POST /api/v1/brands
// @access   Private
const addBrand = asyncHandler(async (req, res) => {
  console.log("Uploaded File:", req.file); // ✅ تأكد أن الصورة تُرفع إلى Cloudinary
  const brand = await BrandModel.create(req.body);
  res.status(201).json({ message: "Success", data: brand });
});

// @desc     Get list of brands
// @route    GET /api/v1/brands
// @access   Public
const getAllBrands = getAll(BrandModel);

// @desc     Get Specific brand by id
// @route    GET /api/v1/brands/:id
// @access   Public
const getSpecificBrand = getOne(BrandModel);

// @desc     Update Specific brand by id
// @route    PUT /api/v1/brands/:id
// @access   Private
const updateBrand = updateOne(BrandModel);
// @desc     Delete Specific brand by id
// @route    DELETE /api/v1/brands/:id
// @access   Private
const deleteBrand = deleteOne(BrandModel);

export {
  addBrand,
  getAllBrands,
  getSpecificBrand,
  updateBrand,
  deleteBrand,
  resizeBrandImage,
  uploadBrandImage,
};
