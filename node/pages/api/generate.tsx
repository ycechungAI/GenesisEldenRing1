import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { TEMPLATES } from "pages/api/Linguistics";

function createOpenAIApi() {
  let configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  if (configuration.apiKey === undefined) {
    return null;
  }
  return new OpenAIApi(configuration);
}
const openai = createOpenAIApi();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (openai === null) {
      res.status(500).json({ error: "OpenAI API could not be configured." })
      return;
  }

  if (!req.body.word || req.body.word.length === 0) {
    res.status(400).json({ error: "Message cannot be empty." })
    return;
  }

  const completion = await openai.createCompletion("code-cushman-001", {
    prompt: generatePrompt(req.body.word),
    temperature: 0.5,
    top_p: 1,
    stop: "\n\n",
  });

  let choices = completion.data.choices;
  if (choices === undefined || choices.length === 0 || choices[0].text === undefined) {
    res.status(500).json({ error: "OpenAI did not return a choice." });
    return;
  }

  res.status(200).json({ result: choices[0].text });
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
