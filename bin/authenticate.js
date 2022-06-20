"use strict";

const { Readable } = require("stream"),
      { methods, headers, statusCodes, contentTypes, requestUtilities } = require("necessary");

const { contentFromResponse } = require("./utilities/response"),
      { createBasicAuthorization } = require("./utilities/authorization"),
      { DEFAULT_AUTHENTICATE_HOST } = require("./hosts"),
      { SIGN_IN_API_URI, CREATE_ACCOUNT_API_URI, RESET_PASSWORD_API_URI, CHANGE_PASSWORD_API_URI } = require("./uris");

const { POST_METHOD } = methods,
      { APPLICATION_JSON_CONTENT_TYPE } = contentTypes,
      { createRequest: createRemoteRequest } = requestUtilities,
      { CONTENT_TYPE_HEADER, AUTHORIZATION_HEADER } = headers,
      { OK_200_STATUS_CODE, UNAUTHORIZED_401_STATUS_CODE } = statusCodes;

function signIn(configuration, emailAddressOrUsername, password, callback) {
  const uri = SIGN_IN_API_URI,
        email_address_or_username = emailAddressOrUsername, ///
        body = {
          password,
          email_address_or_username
        };

  signInOrCreateAccount(configuration, uri, body, callback);
}

function createAccount(configuration, emailAddress, username, password, callback) {
  if (callback === undefined) {
    callback = password;  ///
    password = username;  ///
    username = null;
  }

  const uri = CREATE_ACCOUNT_API_URI,
        email_address = emailAddress, ///
        body = {
          email_address,
          username,
          password
        };

  signInOrCreateAccount(configuration, uri, body, callback);
}

function resetPassword(configuration, emailAddress, callback) {
  const uri = RESET_PASSWORD_API_URI,
        email_address = emailAddress, ///
        body = {
          email_address
        };

  makeRemoteRequest(configuration, uri, body, (error, remoteResponse) => {
    if (error) {
      error = true;

      callback(error);

      return;
    }

    const { statusCode } = remoteResponse;

    switch (statusCode) {
      case OK_200_STATUS_CODE:
      case UNAUTHORIZED_401_STATUS_CODE: {
        error = false;

        callback(error);

        break;
      }

      default: {
        error = true;

        break;
      }
    }
  });
}

module.exports = {
  signIn,
  createAccount,
  resetPassword
};

function makeRemoteRequest(configuration, uri, body, callback) {
  const { authenticateHost = DEFAULT_AUTHENTICATE_HOST } = configuration,
        basicAuthorization = createBasicAuthorization(configuration),
        authorization = basicAuthorization,  ///
        host = authenticateHost,  ///
        query = {},
        method = POST_METHOD,
        headers = {},
        content = JSON.stringify(body), ///
        contentType = APPLICATION_JSON_CONTENT_TYPE;

  headers[CONTENT_TYPE_HEADER] = contentType;

  headers[AUTHORIZATION_HEADER] = authorization;

  const remoteRequest = createRemoteRequest(host, uri, query, method, headers, callback);

  const readable = Readable.from(content);

  readable.pipe(remoteRequest);
}

function signInOrCreateAccount(configuration, uri, body, callback) {
  makeRemoteRequest(configuration, uri, body, (error, remoteResponse) => {
    if (error) {
      const accessToken = null,
            identityToken = null;

      error = true;

      callback(error, accessToken, identityToken);

      return;
    }

    const { statusCode } = remoteResponse;

    switch (statusCode) {
      case OK_200_STATUS_CODE: {
        accessTokenAndIdentityTokenFromRemoteResponse(remoteResponse, (accessToken, identityToken) => {
          error = false;

          callback(error, accessToken, identityToken);
        });

        break;
      }

      case UNAUTHORIZED_401_STATUS_CODE: {
        const accessToken = null,
              identityToken = null;

        error = false;

        callback(error, accessToken, identityToken);

        break;
      }

      default: {
        const accessToken = null,
              identityToken = null;

        error = true;

        callback(error, accessToken, identityToken);

        break;
      }
    }
  });
}

function accessTokenAndIdentityTokenFromRemoteResponse(remoteResponse, callback) {
  const response = remoteResponse;  ///

  contentFromResponse(response, (content) => {
    const jsonString = content, ///
          json = JSON.parse(jsonString),
          { access_token = null, identity_token = null } = json,
          accessToken = access_token, ///
          identityToken = identity_token; ///

    callback(accessToken, identityToken);
  });
}
