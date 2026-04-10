import { Router } from "express";
import { testAiAction } from "../../controllers/ai/index.js";

const router = Router();

router.post("/test", testAiAction);

export default router;
