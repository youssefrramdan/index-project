import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnection from "./config/database.js";
import categoryRouter from "./Routes/category.routes.js";
import { ApiError } from "./utils/apiError.js";
import globalError from "./middlewares/errorMiddleware.js";
dotenv.config({ path: "./config.env" });

//db connection
dbConnection();

// express app
const app = express();

// middlewares
app.use(express.json());
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// mount Routes
app.use("/api/v1/categories", categoryRouter);
app.all("*", (req, res, next) => {
  next(new ApiError(`Cant find this route ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

// Handling Sync Errors and Unhandled Rejections in Node.js (Outside Express)
// When working with Express.js and Node.js, 
// not all errors are caught inside Express middleware.
//  Some errors occur at the system level (like unhandled promise rejections or synchronous exceptions).
//  You need to listen for these errors globally using Node.js process events.

// listen any regication outside express
// Events =>listen event => return callback(err)
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down ...`);
    process.exit(1);
  });
});
// What about errors that happen synchronously outside Express?
// For example, if an error occurs before Express starts,
//  it won't be caught by Express error handling middleware.

process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.name} | ${err.message}`);
  // Gracefully shutting down
  process.exit(1); // Exit immediately with failure code
});


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT} ....`);
});
