import express from "express";
import {
  getAllCategory,
  getProducts,
  getProductByID,
  createProduct,
  getAllVendor,
  updateProduct,
} from "./productController";
import { createProductValidation } from "./productValidation";
import { roleMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/", getProducts);
router.get("/categories", getAllCategory);
router.get("/vendors", getAllVendor);
router.get("/:id", getProductByID);

//vendor endpoint
router.post(
  "/",
  createProductValidation,
  roleMiddleware(["vendor", "admin"]),
  createProduct
);

router.put(
  "/:id",
  createProductValidation,
  roleMiddleware(["vendor", "admin"]),
  updateProduct
);

export default router;
