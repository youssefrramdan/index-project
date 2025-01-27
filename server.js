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

// listen any regication outside express
// Events =>listen event => return callback(err)
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down ...`);
    process.exit(1);
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT} ....`);
});
