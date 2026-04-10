import { Router } from "express";
import folderRouter from "./folders/index.js";
import filesRouter from './file/index.js'
import userRouter from "./user/index.js"
import aiRouter from "./ai/index.js"

const router = Router();

router.use("/folder", folderRouter);
router.use("/files", filesRouter);
router.use("/user", userRouter);
router.use("/ai", aiRouter);
    
export default router;

