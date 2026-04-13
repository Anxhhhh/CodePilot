import express from "express";
import {
  createUser,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
  logoutUser,
} from "../../controllers/users/index.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import {
  validateRegister,
  validateLogin,
} from "../../middlewares/validators/user.validators.js";

let router = express.Router();

router.post("/register", validateRegister, createUser);
router.post("/login", validateLogin, loginUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", isAuthenticated, getCurrentUser);
router.post("/logout", isAuthenticated, logoutUser);


export default router;
