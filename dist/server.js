"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("reflect-metadata");
const db_1 = require("./config/db");
const authRouter_1 = __importDefault(require("./features/auth/authRouter"));
const userRouter_1 = __importDefault(require("./features/user/userRouter"));
const handleError_1 = __importDefault(require("./middlewares/handleError"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.use("/api/auth", authRouter_1.default);
app.use("/api/user", userRouter_1.default);
app.get("/api/test", (req, res) => {
    res.status(201).json({ message: "testing works" });
});
// Handle celebrate validation errors
//app.use(errors());
// Custom error handler
app.use((err, req, res, next) => {
    (0, handleError_1.default)(err, req, res, next);
});
// Start the server after initializing the database
(0, db_1.initializeDatabase)()
    .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Error initializing database:", err);
    process.exit(1); // Exit app if database fails to initialize
});
