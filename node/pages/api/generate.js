import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export default async function (req, res) {
  const completion = await openai.createCompletionFromModel({
    model: 'babbage:ft-personal:eugenics-001-2022-04-03-09-54-56',
    prompt: generatePrompt(req.body.word),
    temperature: 0.21,
    top_p: 1,
    stop: "\n",
  });
  console.log("\n\nTEST1+++++++++++++++\n\n");
  console.log(completion);
  console.log("\n\nTEST2+++++++++++++++\n\n");
  console.log(typeof(completion.data.choices));
  console.log(JSON.stringify(completion.data.choices));
  res.status(200).json({ result: completion.data.choices[0][0].text });
}

function generatePrompt(word) {
  const capitalizedword =
    word[0].toUpperCase() + word.slice(1).toLowerCase();
  return `\n${word}\n`;
}
