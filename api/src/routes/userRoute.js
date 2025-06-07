import express from "express"
import { createUser, getUserById, updateUser, deleteUser } from "../controllers/users.js"
import { verifyUser, authorized } from "../middlewares/authUser.js"

const router = express.Router()

router.get("/:id", verifyUser, authorized, getUserById);
router.post("/create", createUser);
router.put("/update/:id", verifyUser, authorized, updateUser);
router.delete("/delete/:id", verifyUser, authorized, deleteUser);

export default router