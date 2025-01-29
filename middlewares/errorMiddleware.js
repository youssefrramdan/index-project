const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    sendErrorForProd(err, res);
  }
};
const sendErrorForDev = (err, res) => res.status(400).json({
    status: err.status,
    Error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorForProd = (err, res) => res.status(400).json({
    status: err.status,
    message: err.message,
  });
export default globalError;
