import dotenv from "dotenv";

dotenv.config();
import { HfInference } from "@huggingface/inference";

const HG_API_KEY = process.env.API_KEY;

const inference = new HfInference(HG_API_KEY);

async function sendRequest() {
  try {
    const response = await inference.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [{ role: "user", content: "Hello, nice to meet you!" }],
      max_tokens: 512,
    });

    console.log("Response:", response.choices[0].message);
  } catch (error) {
    console.error("Error querying the model:", error);
  }
}

sendRequest();
