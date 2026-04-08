import { Router } from "express";
import { createFile } from "../../controllers/files/index.js";
const router = Router();

router.post("/create", createFile);




export default router;
