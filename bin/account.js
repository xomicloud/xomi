"use strict";

const { methods, statusCodes, requestUtilities } = require("necessary");

const { AUTHORIZATION } = require("./constants"),
      { ACCOUNT_API_URI } = require("./uris"),
      { contentFromResponse } = require("./utilities/response"),
      { DEFAULT_ACCOUNT_HOST } = require("./hosts"),
      { IDENTITY_TOKEN_PARAMETER } = require("./parameters"),
      { createBasicAuthorisation } = require("./utilities/authorisation");

const { GET_METHOD } = methods,
      { createRequest: createRemoteRequest } = requestUtilities,
      { OK_200_STATUS_CODE, BAD_GATEWAY_502_STATUS_CODE } = statusCodes;

function account(configuration, identityToken, callback) {
  const { accountHost = DEFAULT_ACCOUNT_HOST } = configuration,
        basicAuthorisation = createBasicAuthorisation(configuration),
        authorization = basicAuthorisation,  ///
        uri = ACCOUNT_API_URI.replace(IDENTITY_TOKEN_PARAMETER, identityToken),
        host = accountHost,  ///
        query = {},
        method = GET_METHOD,
        headers = {};

  headers[AUTHORIZATION] = authorization;

  const remoteRequest = createRemoteRequest(host, uri, query, method, headers, (error, remoteResponse) => {
    if (error) {
      const account = null,
            statusCode = BAD_GATEWAY_502_STATUS_CODE;

      callback(statusCode, account);

      return;
    }

    const { statusCode } = remoteResponse;

    if (statusCode !== OK_200_STATUS_CODE) {
      const account = null;

      callback(statusCode, account);

      return;
    }

    accountFromRemoteResponse(remoteResponse, (account) => {
      callback(statusCode, account);
    });
  });

  remoteRequest.end();
}

module.exports = account;

function accountFromRemoteResponse(remoteResponse, callback) {
  const response = remoteResponse;  ///

  contentFromResponse(response, (content) => {
    const jsonString = content, ///
          json = JSON.parse(jsonString),
          account = json;  ///

    callback(account);
  });
}
