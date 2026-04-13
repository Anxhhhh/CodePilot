import { OpenAI } from "openai";

/**
 * Calls Hugging Face API using the OpenAI SDK
 * @param {string} prompt - The user prompt
 * @param {string} [model="meta-llama/Llama-3.1-8B-Instruct"] - The model to use
 * @returns {Promise<string>} - The AI response
 */
export async function getAiResponse(prompt, model = "meta-llama/Llama-3.1-8B-Instruct") {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN,
  });

  try {
    const chatCompletion = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: `You are an AI coding assistant embedded in a code editor called CodePilot. You can both answer questions AND perform file operations.

When a user asks you to CREATE, UPDATE, or DELETE a file, you MUST respond with ONLY a valid JSON object in this exact format (no surrounding text, no markdown code blocks):
{"type":"file_operation","action":"create","file":"path/to/file.ext","content":"file content here"}

For "create" and "update" actions, include the full file content in the "content" field.
For "delete" actions, omit the "content" field.
The "file" path is relative to the project root (e.g., "webdev/index.html").

If the user asks a conversational question or wants to discuss code (not perform a file operation), respond normally with helpful text.

Examples:
- "Create a file called index.html in webdev folder" → respond with the JSON above with action "create"
- "Update style.css to add a red background" → respond with JSON with action "update" and the new full content
- "Delete test.js" → respond with JSON with action "delete"
- "What is React?" → respond with a normal conversational answer`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });


    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("DEBUG: AI API ERROR OBJECT:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    let errorMessage = error.message || "Unknown error";
    
    if (error.response) {
      const detail = error.response.data?.error?.message || error.response.data?.error || JSON.stringify(error.response.data);
      errorMessage = `HF Router Error: ${detail}`;
    } else if (error.status) {
      errorMessage = `HF Router Status ${error.status}: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
}
