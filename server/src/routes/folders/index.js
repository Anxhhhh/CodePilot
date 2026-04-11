import { Router } from "express";
import { createFolder, readFolder } from "../../controllers/folders/index.js";

const router = Router();

router.post("/create", createFolder);
router.post("/read", readFolder);

export default router;
