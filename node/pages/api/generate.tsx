import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!openai.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const word = req.body.word || "";
  if (word.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid word",
      },
    });
    return;
  }

  try {
    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: generatePrompt(word),
      temperature: 0.5,
      top_p: 1,
      stop: ["\n\n", "Input:", '""'],
    });
    res.status(200).json({ result: completion.choices[0].text });
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(word: string) {
  const capitalizedword =
    word[0].toUpperCase() + word.slice(1).toLowerCase();
  return `Suggest a short, cryptic message in the style of a Souls-like game.

Input: ${capitalizedword}
Output:`;
}
