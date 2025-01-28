import express from "express";
import { check, validationResult } from "express-validator";
import mongoose from "mongoose";

const app = express();
app.use(express.json()); // Middleware to parse JSON body

/*
======================================
✅ 1️⃣ Handling Request Validation Errors (express-validator)
======================================
📌 Scenario: The user sends invalid data in the request (e.g., wrong email format).
Solution: Use express-validator to validate input fields and return errors.
*/
app.post("/register", [
  check("email").isEmail().withMessage("Invalid email format"), // Validate email
  check("password").isLength({ min: 8 }).withMessage("Password too short"), // Validate password
], (req, res) => {
  const errors = validationResult(req); // Get validation errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Return errors to user
  }
  res.send("User registered successfully!"); // Proceed if no errors
});

/*
======================================
✅ 2️⃣ Handling Errors in Middleware (next(err))
======================================
📌 Scenario: Something goes wrong inside a route handler.
Solution: Use try-catch and next(err) to send errors to the error-handling middleware.
*/
app.get("/profile", (req, res, next) => {
  try {
    throw new Error("Unexpected Error!"); // Simulating an error
  } catch (err) {
    next(err); // Pass error to the error-handling middleware
  }
});

/*
======================================
✅ 3️⃣ Handling Database Connection Errors (MongoDB Example)
======================================
📌 Scenario: The database connection fails (e.g., invalid MongoDB URI).
Solution: Catch errors when connecting to the database.
*/
mongoose.connect("mongodb://wrong-url") // 🚨 Wrong database URL
  .then(() => console.log("✅ Connected to DB"))
  .catch(err => {
    console.error("❌ Database Connection Error:", err.message);
    process.exit(1); // Exit process if DB connection fails
  });

/*
======================================
✅ 4️⃣ Handling Promise Rejections (unhandledRejection)
======================================
📌 Scenario: A Promise fails but there is no .catch() to handle it.
Solution: Use process.on("unhandledRejection") to catch such errors.
*/
process.on("unhandledRejection", (err) => {
  console.error(`⚠️ Unhandled Promise Rejection: ${err.name} | ${err.message}`); // Log detailed error
  server.close(() => {
    console.error("Shutting down due to unhandled promise rejection...");
    process.exit(1); // Exit after shutting down server
  });
});

// 🚀 Example of an unhandled rejection
Promise.reject(new Error("Database connection lost!"));

/*
======================================
✅ 5️⃣ Handling Unexpected Errors (uncaughtException)
======================================
📌 Scenario: A synchronous error occurs, causing the server to crash.
Solution: Use process.on("uncaughtException") to catch unexpected errors.
*/
process.on("uncaughtException", (err) => {
  console.error(`🚨 Uncaught Exception: ${err.name} | ${err.message}`); // Log detailed error
  process.exit(1); // Exit immediately to prevent undefined behavior
});

// 🚀 Example of an unexpected error
throw new Error("Critical error in the application!");

/*
======================================
✅ 6️⃣ Gracefully Shutting Down the Server (SIGTERM & SIGINT)
======================================
📌 Scenario: The server needs to shut down cleanly (e.g., user presses CTRL+C).
Solution: Use process.on("SIGTERM") and process.on("SIGINT").
*/
process.on("SIGTERM", () => {
  console.log("📌 SIGTERM received. Shutting down...");
  server.close(() => {
    console.log("🛑 Server closed gracefully.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("📌 SIGINT received (CTRL+C). Closing server...");
  server.close(() => {
    console.log("🛑 Server closed.");
    process.exit(0);
  });
});

/*
======================================
✅ Global Error Handling Middleware
======================================
📌 Scenario: Any error that isn't handled explicitly should be caught here.
Solution: Use a centralized error-handling middleware to catch and respond to all errors.
*/
app.use((err, req, res, next) => {
  console.error(`🔥 Error: ${err.message}`);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
