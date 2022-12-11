const dialogflow = require("dialogflow");
const structjson = require("./structjson");
const config = require("../config/keys");
const keypath =
  "C:/Users/Neosoft/Desktop/neomain/monichat-try/keys/reactpageagent-jheq-665499091161.json";
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: keypath,
});
const sessionPath = sessionClient.sessionPath(
  config.googleProjectID,
  config.dialogFlowSessionID
);
const projectID = config.googleProjectID;
const sessionID = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

module.exports = {
  textQuery: async function (text, userID, parameters = {}) {
    let sessionPath = sessionClient.sessionPath(projectID, sessionID + userID);
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
    responses = await self.handleAction(responses);
    console.log(responses, "42");

    return responses;
  },
  handleAction: function (responses) {
    return responses;
  },
  eventQuery: async function (event, userID, parameters = {}) {
    let self = module.exports;
    let sessionPath = sessionClient.sessionPath(projectID, sessionID + userID);

    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          name: event,
          parameters: structjson.jsonToStructProto(parameters),
          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
    };

    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);

    return responses;
  },
};
