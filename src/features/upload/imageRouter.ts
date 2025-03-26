import express from "express";
import { handleImageUpload } from "./upload";

const router = express.Router();

router.post("/", handleImageUpload);

export default router;
