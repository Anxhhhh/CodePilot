import { OpenAI } from "openai";

/**
 * Calls Hugging Face API using the OpenAI SDK
 * @param {string} prompt - The user prompt
 * @param {string} [model="zai-org/GLM-5.1:novita"] - The model to use
 * @returns {Promise<string>} - The AI response
 */
export async function getAiResponse(prompt, model = "zai-org/GLM-5.1:novita") {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN,
  });

  try {
    const chatCompletion = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("AI API Error:", error.message);
    throw new Error(error.response?.data?.error || "Failed to get AI response");
  }
}
