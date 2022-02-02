"use strict";

const { Readable } = require("stream"),
      { methods, headers, httpUtilities, contentTypes, requestUtilities } = require("necessary");

const http = require("./http");

const { createBasicAuthorisation } = require("./utilities/authorisation"),
      { OPEN_ID, CODE, AUTHORIZATION_CODE } = require("./constants"),
      { DEFAULT_CLIENT_URI, DEFAULT_CLIENT_HOST } = require("./defaults");

const { POST_METHOD } = methods,
      { queryStringFromQuery } = httpUtilities,
      { createRequest: createRemoteRequest } = requestUtilities,
      { CONTENT_TYPE_HEADER, CONTENT_LENGTH_HEADER } = headers,
      { APPLICATION_JSON_CONTENT_TYPE, APPLICATION_X_WWW_FORM_ENCODED_CONTENT_TYPE } = contentTypes;

function redirect(configuration, response, createAccount = false) {
  const { clientId, clientURI = DEFAULT_CLIENT_URI, clientHost = DEFAULT_CLIENT_HOST, redirectURI, state = null, additionalParameters = null } = configuration,
        scope = OPEN_ID,  ///
        client_id = clientId,  ///
        redirect_uri = redirectURI,  ///
        response_type = CODE,
        query = {
          scope,
          client_id,
          redirect_uri,
          response_type
        };

  if (state !== null) {
    Object.assign(query, {
      state
    });
  }

  if (additionalParameters !== null) {
    Object.assign(query, additionalParameters);
  }

  if (createAccount) {
    const create_account = createAccount; ///

    Object.assign(query, {
      create_account
    });
  }

  const queryString = queryStringFromQuery(query),
        location = `${clientHost}${clientURI}?${queryString}`;

  http.redirect(response, location);
}

function callback(configuration, code, callback) {
  const { clientHost = DEFAULT_CLIENT_HOST, clientURI = DEFAULT_CLIENT_URI, } = configuration,
        content = createContent(configuration, code),
        readable = Readable.from(content),
        host = clientHost,  ///
        uri = clientURI, ///
        query = {},
        method = POST_METHOD,  ///
        headers = createHeaders(configuration, content),
        request = readable, ///
        remoteRequest = createRemoteRequest(host, uri, query, method, headers, (error, remoteResponse) => {
          let accessToken = null,
              refreshToken = null;

          if (error) {
            callback(error, accessToken, refreshToken);

            return;
          }

          http.contentFromResponse(remoteResponse, (content) => {
            let json;

            const jsonString = content;  ///

            try {
              json = JSON.parse(jsonString);
            } catch (error) {
              callback(error, accessToken, refreshToken);

              return;
            }

            const { access_token = null, refresh_token = null } = json;

            accessToken = access_token; ///
            refreshToken = refresh_token; ///

            callback(error, accessToken, refreshToken);
          });
        });

  request.pipe(remoteRequest);
}

module.exports = {
  redirect,
  callback
};

function createHeaders(configuration, content) {
  const accept = APPLICATION_JSON_CONTENT_TYPE,
        contentType = APPLICATION_X_WWW_FORM_ENCODED_CONTENT_TYPE,
        contentLength = content.length,
        basicAuthorisation = createBasicAuthorisation(configuration),
        authorization = basicAuthorisation, ///
        headers = {
          accept,
          authorization
        };

  headers[CONTENT_TYPE_HEADER] = contentType;

  headers[CONTENT_LENGTH_HEADER] = contentLength;

  return headers;
}

function createContent(configuration, code) {
  const query = createQuery(configuration, code),
        queryString = queryStringFromQuery(query),
        content = queryString;  ///

  return content;
}

function createQuery(configuration, code) {
  const { redirectURI } = configuration,
        grant_type = AUTHORIZATION_CODE,
        redirect_uri = redirectURI,  ///
        query = {
          code,
          grant_type,
          redirect_uri
        };

  return query;
}
