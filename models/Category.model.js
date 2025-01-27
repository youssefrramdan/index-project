import mongoose from "mongoose";

//! create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name ..."],
      maxlength: [32, "Too long category name ..."],
    },
    //A and B => a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
  },
  // mongoose schema options ==> options avaliable in mongoose
  // time
  { timestamps: true }
);
//? Create model
const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;
