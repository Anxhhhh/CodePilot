import { Router } from "express";
import folderRouter from "./folders/index.js";

const router = Router();

router.use("/folder", folderRouter);

export default router;
