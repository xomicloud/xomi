"use strict";

const { methods, statusCodes, requestUtilities } = require("necessary");

const { AUTHORIZATION } = require("./constants"),
      { ACCOUNT_API_URI } = require("./uris"),
      { contentFromResponse } = require("./utilities/response"),
      { DEFAULT_ACCOUNT_HOST } = require("./hosts"),
      { IDENTITY_TOKEN_PARAMETER } = require("./parameters"),
      { createBasicAuthorization } = require("./utilities/authorization");

const { GET_METHOD } = methods,
      { createRequest: createRemoteRequest } = requestUtilities,
      { OK_200_STATUS_CODE, UNAUTHORIZED_401_STATUS_CODE } = statusCodes;

function account(configuration, identityToken, callback) {
  const { accountHost = DEFAULT_ACCOUNT_HOST } = configuration,
        basicAuthorization = createBasicAuthorization(configuration),
        authorization = basicAuthorization,  ///
        uri = ACCOUNT_API_URI.replace(IDENTITY_TOKEN_PARAMETER, identityToken),
        host = accountHost,  ///
        query = {},
        method = GET_METHOD,
        headers = {};

  headers[AUTHORIZATION] = authorization;

  const remoteRequest = createRemoteRequest(host, uri, query, method, headers, (error, remoteResponse) => {
    if (error) {
      const account = null;

      error = true;

      callback(error, account);

      return;
    }

    const { statusCode } = remoteResponse;

    switch (statusCode) {
      case OK_200_STATUS_CODE: {
        accountFromRemoteResponse(remoteResponse, (account) => {
          error = false;

          callback(error, account);
        });

        break;
      }

      case UNAUTHORIZED_401_STATUS_CODE: {
        const account = null;

        error = false;

        callback(error, account);

        break;
      }

      default: {
        const account = null;

        error = true;

        callback(error, account);

        break;
      }
    }
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
