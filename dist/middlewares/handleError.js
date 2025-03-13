"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const handleError = (err, req, res, next) => {
    console.error("Error caught in middleware:", err); // Debugging line
    // Handle Celebrate validation errors properly
    if ((0, celebrate_1.isCelebrateError)(err)) {
        // Get the first validation error message
        const errorMessages = [];
        err.details.forEach((value) => {
            value.details.forEach((detail) => {
                errorMessages.push(detail.message);
            });
        });
        // Combine the error messages into a single string or send the first one
        const message = errorMessages.join(', ') || "Validation failed";
        return res.status(400).json({
            error: "Validation error",
            message: message,
        });
    }
    // General error handling
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        error: message,
    });
};
exports.default = handleError;
