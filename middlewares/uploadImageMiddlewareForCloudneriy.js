/* eslint-disable import/no-extraneous-dependencies */
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import { ApiError } from "../utils/apiError.js";

dotenv.config({ path: "../config.env" });

cloudinary.config({
  cloud_name: "dqicm2ir2",
  api_key: "722638671225421",
  api_secret: "vu7qUoXXgII4RkU3yHHY2q912sg",
});

const uploadSingleImageCloud = (fieldName, folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const uniqueSuffix = uuidv4();
      return {
        folder: folderName,
        format: "jpeg",
        public_id: `${folderName}-${uniqueSuffix}-${Date.now()}`,
      };
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed", 400), false);
    }
  };

  const upload = multer({ storage, fileFilter });

  return upload.single(fieldName);
};

export default uploadSingleImageCloud;
