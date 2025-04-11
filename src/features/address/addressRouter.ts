import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { getUserAddresses, addUserAddress } from "./addressController";

const router = Router();

router.get("/", getUserAddresses);
router.post("/", addUserAddress);

export default router;
