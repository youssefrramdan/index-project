// Error Handling Lifecycle in Node.js & Express.js

// 1. Using Promises (then/catch)
// If a promise is used (e.g., database query or an API call), 
// the `.catch()` block handles any errors that occur during the operation.

someAsyncFunction()
  .then((result) => {
    // Code executes if the promise resolves successfully
    console.log(result);
  })
  .catch((error) => {
    // Handles errors from the promise
    console.error("Error caught in .catch():", error);
  });

// 2. Using try/catch with Synchronous Code or Await
// For synchronous code or when using `await`, a `try/catch` block is used to 
// catch and handle errors manually.

try {
  const result = await someAsyncFunction(); // Await async operation
  console.log(result); // Code executes if no error occurs
} catch (error) {
  // Handles any error that occurs during the execution of the try block
  console.error("Error caught in try/catch:", error);
}

// 3. Using Express Async Error Handler (asyncHandler)
// In Express, when using asynchronous route handlers, errors must be caught 
// and passed to the Express error-handling middleware.
// Libraries like `express-async-handler` simplify this process by automatically 
// forwarding errors to the next middleware (Express's built-in error handler).

const asyncHandler = require("express-async-handler");

// Example of an Express route with asyncHandler
app.get(
  "/example",
  asyncHandler(async (req, res) => {
    const data = await someAsyncFunction(); // If an error occurs here...
    res.status(200).json({ data }); // Success response
  })
);

// If an error is thrown inside the asyncHandler function, it is passed to
// the next middleware (Express error handler).

// 4. Express Custom Error Handling Middleware
// Express allows you to define custom error-handling middleware to handle
// errors passed from the asyncHandler or thrown elsewhere in the application.

app.use((err, req, res, next) => {
  console.error("Custom Error Handler:", err.message);

  // Customize the response sent to the client based on the error
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});
