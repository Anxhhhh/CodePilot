import { getAiResponse } from "../../utils/ai.util.js";
import { success, badRequest, internalError } from "../../utils/response.util.js";


export const testAiAction = async (req, res) => {
  console.log("=== AI ACTION HIT ===");
  try {
    const { prompt, model } = req.body;
    console.log("Prompt:", prompt);
    console.log("Model requested:", model);

    if (!prompt) {
      return badRequest(res, {}, "Prompt is required");
    }

    if (!process.env.HF_TOKEN) {
      console.error("HF_TOKEN is missing in process.env");
      return internalError(res, {}, "Hugging Face Token is not configured on server. Please check your .env file.");
    }

    if (!process.env.HF_TOKEN.startsWith("hf_")) {
      console.warn("HF_TOKEN might be invalid (does not start with 'hf_')");
    }

    const response = await getAiResponse(prompt, model);

    return success(res, { response }, "AI response retrieved successfully");
  } catch (err) {
    console.error("AI Controller Error:", err.message);
    return internalError(res, { error: err.message }, err.message || "Error getting AI response");
  }
};

