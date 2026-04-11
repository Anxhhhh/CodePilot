import express from "express";
import {
  createUser,
  loginUser,
  refreshAccessToken,
} from "../../controllers/users/index.js";
let router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

export default router;
