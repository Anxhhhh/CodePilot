import { getAiResponse } from "../../utils/ai.util.js";
import { success, badRequest, internalError } from "../../utils/response.util.js";


export const testAiAction = async (req, res) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt) {
      return badRequest(res, {}, "Prompt is required");
    }

    if (!process.env.HF_TOKEN) {
      return internalError(res, {}, "Hugging Face Token is not configured on server");
    }

    const response = await getAiResponse(prompt, model);

    return success(res, { response }, "AI response retrieved successfully");
  } catch (err) {
    return internalError(res, {}, err.message);
  }
};

