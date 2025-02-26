import { Amplify } from 'aws-amplify';

Amplify.configure({
  API: {
    endpoints: [
      {
        name: 'cakesApi', // Name of the API
        endpoint: 'https://2jlxzjid0h.execute-api.eu-west-2.amazonaws.com/dev', // Replace with your API Gateway URL
        region: 'eu-west-2' // e.g., 'us-east-1'
      }
    ]
  }
});
