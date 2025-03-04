import express from "express";
import { categoryGetAll } from "./categoryController";

const router = express.Router();

router.post("/allCategory", categoryGetAll);

export default router;

