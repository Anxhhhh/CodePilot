import { Router } from "express";
import { createFile, editFile, getFileContent, deleteFile } from "../../controllers/files/index.js";
const router = Router();

router.post("/create", createFile);
router.post("/edit", editFile);
router.get("/read", getFileContent);
router.delete("/delete", deleteFile);


export default router;
