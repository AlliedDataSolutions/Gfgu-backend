import { Request, Response, NextFunction } from "express";
import { isCelebrateError } from "celebrate";

const handleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  console.error("Error caught in middleware:", err); // Debugging line
  console.log(err)

  // Handle Celebrate validation errors properly
  if (isCelebrateError(err)) {
    // Get the first validation error message
    const errorMessages: string[] = [];

    err.details.forEach((value) => {
      value.details.forEach((detail: any) => {
        errorMessages.push(detail.message);
      });
    });

    // Combine the error messages into a single string or send the first one
    const message = errorMessages.join(", ") || "Validation failed";

    return res.status(400).json({
      error: "Validation error",
      message: message,
    });
  }

  // General error handling
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    error: "Error",
    message: message,
  });
};

const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

export { notFoundMiddleware, handleError };
