/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prefer-const */
import asyncHandler from "express-async-handler";
import slugify from "slugify";

// @desc     Get all products
// @route    GET /api/v1/products
// @access   Public
const getAllProduct = asyncHandler(async (req, res) => {
  // 1) Filtering
  const query = { ...req.query };
  const excludesFields = ["page", "limit", "skip", "fields", "sort", "keyword"];
  excludesFields.forEach((field) => delete query[field]);

  let queryStr = JSON.stringify(query);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // Convert queryStr back to object
  const filters = JSON.parse(queryStr);

  // 2) Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  // 3) filters by [gt|gte|lt|lte|in]
  let mongooseQuery = ProductModel.find(filters)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "category",
      select: "name -_id",
    });
  // 4) Searching By specific keyword
  if (req.query.keyword) {
    const searchQuery = {
      $or: [
        { title: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
      ],
    };
    mongooseQuery = ProductModel.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "category",
        select: "name -_id",
      });
  }
  // 5) Sorting By specific property
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("-createdAt");
  }

  // 4) Field selection
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  }

  // Execute query
  const products = await mongooseQuery;

  // Response
  res.status(200).json({
    message: "success",
    page,
    limit,
    result: products.length,
    data: products,
  });
});

// @desc     Get specific product by id
// @param {String} id
// @route    GET /api/v1/products/:productId
// @access   Public
const getSpecificProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const product = await ProductModel.findById(productId).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    return next(new ApiError(`No product found with ID: ${productId}`, 404));
  }
  res.status(200).json({
    message: "success",
    data: product,
  });
});

// @desc     Create a new product
// @route    POST /api/v1/products
// @access   privite
const createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  const product = await ProductModel.create(req.body);
  res.status(200).json({
    message: "success",
    data: product,
  });
});

// @desc     Update an existing product
// @route    PUT /api/v1/products/:productId
// @access   Private
const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new ApiError(`No product found with ID: ${id}`, 404));
  }
  res.status(200).json({
    message: "success",
    data: product,
  });
});

// @desc     Delete an existing product
// @route    DELETE /api/v1/products/:productId
// @access   Private

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndDelete({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new ApiError(`No product found with ID: ${id}`, 404));
  }
  res.status(200).json({
    message: "success",
    data: product,
  });
});
export {
  getAllProduct,
  getSpecificProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
