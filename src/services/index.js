import axios from 'axios';

// function timeout(ms) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve();
//     }, ms);
//   });
// }

async function askQuestion(query) {
  // await timeout(5000);
  const respDef = await axios.get('/api_example.json');
  const resp = await axios.post(
    'https://seh-ai-api.azurewebsites.net/llm',
    {
      query,
      locator_code: 'en',
    },
    {
      headers: {
        'API-Key': '1a864b18-7a78-48f5-baf8-a2dd434a8de3s',
      },
    },
  );
  respDef.data.answer = resp.data.answers[1].value;
  return respDef.data;
}

export default {
  askQuestion,
};
