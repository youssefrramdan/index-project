import multer from "multer";
import { ApiError } from "../utils/apiError.js";

const uploadSingleImage = (fieldName) => {
  const multerStorage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed", 400), false); 
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter });

  return upload.single(fieldName); 
};

export default uploadSingleImage;
