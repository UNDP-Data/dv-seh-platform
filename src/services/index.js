import axios from 'axios';

async function askQuestion(query, type) {
  try {
    // Fetch default response
    const respDef = await axios.get('/api_example.json');

    // Make the post request
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

    // Update response data
    respDef.data.answer = resp.data.answer;
    respDef.data.sources = resp.data.excerpts_dict;
    respDef.data.prompts = resp.data.query_ideas;
    respDef.data.entities = resp.data.entities;

    return resp.data;
  } catch (error) {
    // Handle HTTP errors
    if (error.response) {
      // Server responded with a status other than 200 range
      return {
        error: true,
        status: error.response.status,
        message:
          error.response.data.message ||
          'An error occurred! we are working on serving you better.Please try again later',
      };
    }

    if (error.request) {
      // Request was made but no response was received
      return {
        error: true,
        message: 'No response received from server',
      };
    }

    // Something else happened while setting up the request
    return {
      error: true,
      message: error.message,
    };
  }
}

export default {
  askQuestion,
};
