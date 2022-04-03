const fs = require("fs");
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const response = await openai.createEdit("text-davinci-edit-001", {
    input: generatePrompt(req.body.word),
    instruction: "Replace Input by using the closest matching template array below\n  template: [\"**** ahead\", \"No **** ahead\", \"**** required ahead\", \"Be wary of ****\", \"Try ****\", \"Likely ****\", \"Seek ****\", \"Still no ****...\",  \"Why is it always ****?\", \"If only I had a ****...\", \"Didn't expect ****...\", \"Visions of ****...\", \"Could this be a ****?\", \"Time for ****\", \"****, O ****\", \"Behold, ****!\", \"Offer ****\", \"Praise the ****!\", \"Let there be ****\", \"Ahh, ****..\"]",
    temperature: 0.21,
    top_p: 1,
  });
  console.log(response.data.created);
  res.status(200).json({ result: response.data.choices[0].text });
}

function generatePrompt(word) {
  return `\n${word}\n`;
}
