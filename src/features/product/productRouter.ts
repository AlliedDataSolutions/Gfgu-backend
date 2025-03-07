import express from "express";
import { productGetAll, productGetById } from "./productController";


const router = express.Router();

router.post("/getAll", productGetAll);
router.post("/getById", productGetById)

export default router;

