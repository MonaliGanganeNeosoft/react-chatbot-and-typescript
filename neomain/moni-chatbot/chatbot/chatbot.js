const dialogflow = require("dialogflow");
const structjson = require("./structjson");
const config = require("../config/keys");

const projectID = config.googleProjectID;
console.log(projectID);
const creadentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey,
};
console.log(creadentials);

const sessionClient = new dialogflow.SessionsClient({
  projectID,
  creadentials,
});
console.log(sessionClient);
const sessionPath = sessionClient.sessionPath(
  config.googleProjectID,
  config.dialogFlowSessionID
);
console.log(sessionPath);
module.exports = {
  textQuery: async function (text, parameters = {}) {
    let self = module.exports;

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
      queryParams: {
        payload: {
          data: parameters,
        },
      },
    };
    console.log(request, "41");
    let responses = await sessionClient.detectIntent(request);
    console.log(responses, "42");
    responses = await self.handleAction(responses);
    console.log(responses, "44");
    return responses;
  },
  handleAction: function (responses) {
    return responses;
  },
  eventQuery: async function (event, parameters = {}) {
    let self = module.exports;
    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          name: event,
          parameters: structjson.jsonToStructProto(parameters), //Dialogflow's v2 API uses gRPC. You'll need a jsonToStructProto method to convert your JavaScript object to a proto struct.
          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
    };

    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);
    return responses;
  },
};
