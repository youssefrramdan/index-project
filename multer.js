import multer from "multer";
import sharp from "sharp";

// ✅ Use Memory Storage because sharp processes images in memory
const storage = multer.memoryStorage();

// 🔍 File filter to allow only image uploads
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true); // ✅ Accept the file
    } else {
        cb(new Error("Only Images allowed ❌"), false); // ❌ Reject non-image files
    }
};

// ⚡ Multer setup using Memory Storage
const upload = multer({
    storage: storage, // ✅ Store files in memory instead of disk
    fileFilter: fileFilter, // 🎯 Apply filtering to accept only images
});

// 📌 Middleware to process the image using Sharp
const processImage = async (req, res, next) => {
    if (!req.file) return next(); // ✅ Skip processing if no file is uploaded

    try {
        // 🖼️ Process the image and convert it to JPEG
        req.file.buffer = await sharp(req.file.buffer)
            .resize(500, 500) // 🔄 Resize image to 500x500 pixels
            .toFormat("jpeg") // 📷 Convert image to JPEG format
            .jpeg({ quality: 80 }) // 🎚️ Set JPEG quality to 80%
            .toBuffer(); // 🔄 Convert the processed image back to a Buffer

        next(); // ✅ Proceed to the next middleware after processing
    } catch (error) {
        next(error); // ❌ Pass the error to the error-handling middleware
    }
};

// 📥 Middleware to upload and process a single image
const uploadSingleImage = upload.single("image");

export { uploadSingleImage, processImage };
// -------------------------------------------------------------------------------------
// DiskStorage - engine (Multer configuration for saving files on disk)
// const multerStorage = multer.diskStorage({
//   // Define the destination folder where uploaded files will be stored
//   destination: function (req, file, callBack) {
//     callBack(null, "uploads/categories"); // Save files in the 'uploads/categories' directory
//   },
//   // Define the filename format for uploaded files
//   filename: function (req, file, callBack) {
//     // Extract file extension (e.g., 'jpg', 'png', etc.)
//     const extention = file.mimetype.split("/")[1];
//     // Generate a unique filename using UUID and timestamp
//     // Format: category-UUID-TIMESTAMP.EXT (e.g., category-123e4567-e89b-12d3-a456-426614174000-1701234567890.jpg)
//     const filename = `category-${uuid4()}-${Date.now()}.${extention}`;

//     callBack(null, filename); // Pass the generated filename to Multer
//   },
// });
// // callBack like next in express
// // 🔍 File filter to allow only image uploads
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true); // ✅ Accept the file
//   } else {
//     cb(new ApiError("Only Images allowed ❌", 400), false); // ❌ Reject non-image files
//   }
// };
// // Initialize multer with the defined storage configuration (multerStorage)
// const upload = multer({ storage: multerStorage, fileFilter: fileFilter });

// // Create a middleware to handle a single file upload with the field name 'image'
// // This middleware will process only one image file at a time
// const uploadCategoryImage = upload.single("image");
