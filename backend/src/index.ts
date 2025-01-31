import { baseNodePrompt } from "./defaults/node";
import { baseReactPrompt } from "./defaults/react";
import { DEFAULT_PROMPT, getSystemPrompt } from "./prompts";
import streamResponse from "./stream";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import fs from "fs";

dotenv.config();

const app = express();
app.use(express.json());

const { LLM_URL, MODEL, API_KEY } = process.env;

app.post("/template", async function (req: Request, res: Response) {
  const prompt: string = req.body.prompt;

  try {
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    if (!LLM_URL || !MODEL || !API_KEY) {
      res.status(500).json({ error: "Missing API configuration" });
      return;
    }

    const response = await fetch(LLM_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "user", content: prompt },
          {
            role: "system",
            content:
              "Return either 'node' or 'react' based on what you think this project should be. Only return a single word: either 'node' or 'react'. Do not return anything extra.",
          },
        ],
      }),
    });

    if (!response.ok) {
      res.json({ error: `API request failed with status ${response.status}` });
    }

    const data = await response.json();
    console.log("Raw API Response:", JSON.stringify(data, null, 2));

    const aiResponse = data?.choices?.[0]?.message?.content?.trim();

    if (!aiResponse) {
      res.json({ error: "Invalid response format from LLM" });
    }

    if (aiResponse === "react") {
      res.json({
        prompts: [DEFAULT_PROMPT, baseReactPrompt],
      });

      return;
    }
    if (aiResponse === "node") {
      res.json({
        prompts: baseNodePrompt,
      });

      return;
    }

    res.json({
      message: "can't access this",
    });

    return;
  } catch (error: any) {
    console.error("ERROR:", error.message || error);
    res
      .status(500)
      .json({ error: error.message || "An unexpected error occurred" });
    return;
  }
});

// async function sendRequest() {
//   try {
//     const response = await fetch(`${process.env.LLM_URL}`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: `${process.env.MODEL}`,
//         messages: [
//           {
//             role: "user",
//             content: "",
//           },

//           {
//             role: "user",
//             content: `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n{${baseReactPrompt}} \n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n - .gitignore\n - package-lock.json -.bolt/prompt`,
//           },
//           {
//             role: "user",
//             content: "create a backend for a todo app in express",
//           },
//         ],
//         stream: true,
//       }),
//     });

//     await streamResponse(response);
//   } catch (error) {
//     console.log(`ERROR: ${error}`);
//   }
// }

// sendRequest();

app.listen(3000, () => {
  console.log("listening");
});
