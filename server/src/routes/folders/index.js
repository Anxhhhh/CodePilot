import { Router } from "express";
import { createFolder } from "../../controllers/folders/index.js";

const router = Router();

router.get("/create", createFolder);

export default router;
