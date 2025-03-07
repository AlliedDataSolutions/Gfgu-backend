import express from "express";
import {
  getAllCategory,
  getProducts,
  getProductByID,
  createProduct,
} from "./productController";
import { createProductValidation } from "./productValidation";
import { roleMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductByID);
router.get("/categories", getAllCategory);

//vendor endpoint
router.post(
  "/",
  createProductValidation,
  roleMiddleware(["vendor", "admin"]),
  createProduct
);

export default router;
