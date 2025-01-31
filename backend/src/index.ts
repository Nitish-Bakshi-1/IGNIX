import streamResponse from "./stream";
import dotenv from "dotenv";
dotenv.config();
const API_KEY_RES = process.env.API_KEY;
async function sendRequest() {
  try {
    const response = await fetch(`${process.env.LLM_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY_RES}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "write code for a simple todo app",
          },
        ],
        stream: true,
      }),
    });

    await streamResponse(response);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
}

sendRequest();
