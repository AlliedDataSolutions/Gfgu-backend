import express from "express";
import { productGetAll } from "./productController";

const router = express.Router();

router.post("/allProduct", productGetAll);

export default router;

