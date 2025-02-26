import { Amplify } from "aws-amplify";

Amplify.configure({
  API: {
    endpoints: [
      {
        name: "cakesApi",
        endpoint: "https://2jlxzjid0h.execute-api.eu-west-2.amazonaws.com/dev",
        region: "eu-west-2",
      },
    ],
  },
});
