import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { getUserAddresses, addUserAddress, deleteUserAddress, updateUserAddress } from "./addressController";

const router = Router();

router.use(authMiddleware);

router.get("/", getUserAddresses);
router.post("/", addUserAddress);

router.delete("/:id", deleteUserAddress);   
router.put("/:id", updateUserAddress);

export default router;
