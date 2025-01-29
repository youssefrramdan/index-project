import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand required"],
      unique: [true, "brand must be unique"],
      minlength: [3, "Too short brand name ..."],
      maxlength: [32, "Too long brand name ..."],
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);
//? Create model
const BrandModel = mongoose.model("Brand", brandSchema);

export default BrandModel;
