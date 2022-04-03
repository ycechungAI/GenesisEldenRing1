import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
  //training_file: "file-DQ0n1KonqO1BH4gd1wqi7oet",
  
// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req, res) {
  const completion = await openai.createCompletionFromModel({
    model: 'babbage:ft-personal:eugenics-001-2022-04-03-09-54-56',
    prompt: generatePrompt(req.body.word),
    temperature: 0.13,
    top_p: 1,
    stop: ["\n", ".", "->"],
  });
   //const completion = response; 
  console.log("\n\nTEST1+++++++++++++++\n\n");
  console.log(completion.headers);
  console.log("\n\nTEST2+++++++++++++++\n\n");
  console.log(typeof(completion.data.choices));
  console.log(JSON.stringify(completion.data));
  res.status(200).json({ result: completion.data.choices[0].text });
};

function generatePrompt(word) {
  const capitalizedword =
    word[0].toUpperCase() + word.slice(1).toLowerCase();
  console.log(capitalizedword);
  return `${capitalizedword} ->`;
}

    /*
  const response = await openai.createAnswer({
    search_model: "ada",
    model: 'babbage:ft-personal:eugenics-001-2022-04-03-09-54-56',  
    examples_context: "dark souls message translator",
    documents: ['**** ahead', 'No **** ahead', '**** required ahead', 'Be wary of ****', 'Try ****', 'Likely ****', 'Seek ****', 'Still no ****...',  'Why is it always ****?', 'If only I had a ****...', 'Did not expect ****...', 'Visions of ****...', 'Could this be a ****?', 'Time for ****', '****, O ****', 'Behold, ****!', 'Offer ****', 'Praise the ****!', 'Let there be ****', 'Ahh, ****..'],
    examples: [["Watch out for the great enemy creature.", "Be wary of strong foe."],["There is an item in front and there is no one ahead", "item ahead and no boss ahead"],
                ["There is a weapon that deals frozen attack ahead", "armament ahead, frost ahead"]],
    question: req.body.word,
    temperature: 0.1,
    top_p: 1,
    stop: "\n",
    });
  */  