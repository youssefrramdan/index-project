import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title required"],
      unique: [true, "Category must be unique"],
      trim: true,
      minlength: [2, "Too short Product Tittle"],
      maxlength: [100, "Too long Product Tittle"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description Required"],
      minlength: [40, "Too short Product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price required"],
      trim: true,
      max: [200000, "too long Product price"],
    },
    priceAfterDiscount: {
      type: Number,
      trim: true,
      maxlength: [20, "too long Product price"],
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product imageCover IS required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      requierd: [true, "Product must be belong to Category "],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "rating must be above or equal 1.0"],
      max: [5, "rating must be above or equal 1.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
