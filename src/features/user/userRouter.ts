import express from "express";
import { userProfile, updateEmail, updateName, updatePassword } from "./userController";

const router = express.Router();

router.get("/profile", userProfile);


router.put("/profile/name", updateName);

router.put("/profile/email", updateEmail);

router.put("/profile/password", updatePassword);

export default router;
