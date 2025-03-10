import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { getUserAddresses, addUserAddress } from "./addressController";

const router = Router();

router.get("/", authMiddleware, getUserAddresses);
router.post("/", authMiddleware, addUserAddress);

export default router;
