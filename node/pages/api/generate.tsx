import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function callOpenAI(word: string) {
  const completion = await openai.completions.create({
    model: "text-davinci-003",
    prompt: generatePrompt(word),
    temperature: 0.5,
    top_p: 1,
    stop: ["\n\n", "Input:", '""'],
  });
  return completion.choices[0].text;
}

async function callGemini(word: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(generatePrompt(word));
  const response = await result.response;
  return response.text();
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const useGemini = process.env.USE_GEMINI === "true";

  if (useGemini && !process.env.GEMINI_API_KEY) {
    res.status(500).json({
      error: {
        message: "Gemini API key not configured.",
      },
    });
    return;
  }

  if (!useGemini && !openai.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured.",
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
    const result = useGemini ? await callGemini(word) : await callOpenAI(word);
    res.status(200).json({ result });
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with API request: ${error.message}`);
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
  return `'''Use input message and translate using template from the list below and replace the **** with a word from the list below only.
  template: "**** ahead", "No **** ahead", "**** required ahead", "Be wary of ****", "Try ****", "Likely ****", "Seek ****", "Still no ****...",  "Why is it always ****?", "If only I had a ****...", "Didn't expect ****...", "Visions of ****...", "Could this be a ****?", "Time for ****", "****, O ****", "Behold, ****!", "Offer ****", "Praise the ****!", "Let there be ****", "Ahh, ****.."

  word_list: "enemy", "weak foe", "strong foe", "monster", "dragon", "boss", "sentry", "group", "pack", "decoy", "undead", "soldier", "knight", "item", "precious item",   "cavalier", "archer", "sniper", "mage", "ordnance", "monarch", "lord", "demi-human", "outsider", "giant", "horse", "dog", "wolf", "rat", "beast", "bird", "raptor", "snake", "crab", "prawn", "octopus", "bug", "scarab", "slug", "wraith", "skeleton", "monstrosity", "ill-omened creature", "item", "necessary item","precious item", "something", "something incredible",
  "treasure chest", "corpse","coffin","trap", "armament"
  '''
  Input: Watch out for the great enemy creature.
  Output: Be wary of strong foe.
  '''
  Input: There is a boss monster that drops a special item in the next room.
  Output: Boss ahead and precious item ahead.
  '''
  Input: There is an item in front and there is no one ahead
  Output: Item ahead and no boss ahead.
  '''''
  Input: ${capitalizedword}
  Output: `;
}
