import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const completion = await openai.createCompletion("code-cushman-001", {
    prompt: generatePrompt(req.body.word),
    temperature: 0.5,
    top_p: 1,
    stop: "\n\n",
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt(word) {
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
