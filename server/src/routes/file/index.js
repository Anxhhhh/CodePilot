import { Router } from "express";
import { createFile, editFile, getFileContent } from "../../controllers/files/index.js";
const router = Router();

router.post("/create", createFile);
router.post("/edit", editFile);
router.get("/read", getFileContent);

export default router;
