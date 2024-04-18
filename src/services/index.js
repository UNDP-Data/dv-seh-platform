import axios from 'axios';

// function timeout(ms) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve();
//     }, ms);
//   });
// }

async function askQuestion(query, type) {
  // await timeout(5000);
  const respDef = await axios.get('/api_example.json');
  const resp = await axios.post(
    'https://seh-ai-api.azurewebsites.net/llm',
    {
      query,
      locator_code: 'en',
      query_type: type, // query_type
    },
    {
      headers: {
        'API-Key': '1a864b18-7a78-48f5-baf8-a2dd434a8de3s',
      },
    },
  );
  // respDef.data.answer = resp.data.answers[1].value; commenting as response data seems to be changed -- Lasya
  respDef.data.answer = resp.data.answer;
  respDef.data.sources = resp.data.excerpts_dict;
  respDef.data.prompts = JSON.parse(resp.data.query_ideas.replace(/'/g, '"'));
  return respDef.data;
}

export default {
  askQuestion,
};
