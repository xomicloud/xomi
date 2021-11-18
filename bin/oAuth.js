"use strict";

const { Readable } = require("stream"),
      { httpUtilities, requestUtilities } = require("necessary");

const http = require("./http");

const { createBasicAuthorisation } = require("./utilities/authorisation");

const { POST_METHOD } = require("./methods"),
      { DEFAULT_CLIENT_URI } = require("./defaults"),
      { CONTENT_TYPE, OPEN_ID, CONTENT_LENGTH, CODE, AUTHORIZATION_CODE } = require("./constants"),
      { APPLICATION_JSON_CONTENT_TYPE, APPLICATION_X_WWW_FORM_ENCODED_CONTENT_TYPE } = require("./contentTypes");

const { queryStringFromQuery } = httpUtilities,
      { request: makeRequest } = requestUtilities;

function redirect(options, response, createAccount = false) {
  const { clientHost, clientId, redirectURI, clientURI = DEFAULT_CLIENT_URI, state = null, additionalParameters = null } = options,
        scope = OPEN_ID,  ///
        client_id = clientId,  ///
        redirect_uri = redirectURI,  ///
        response_type = CODE, ///
        query = {
          scope,
          client_id,
          redirect_uri,
          response_type
        };

  if (state) {
    Object.assign(query, {
      state
    });
  }

  if (createAccount) {
    const create_account = createAccount; ///

    Object.assign(query, {
      create_account
    });
  }

  if (additionalParameters) {
    Object.assign(query, additionalParameters);
  }

  const queryString = queryStringFromQuery(query),
        location = `${clientHost}${clientURI}?${queryString}`;

  http.redirect(response, location);
}

function callback(options, code, callback) {
  const { clientHost, clientURI = DEFAULT_CLIENT_URI, } = options,
        content = createContent(options, code),
        readable = Readable.from(content),
        host = clientHost,  ///
        uri = clientURI, ///
        query = {},
        method = POST_METHOD,  ///
        headers = createHeaders(options, content),
        request = readable, ///
        remoteRequest = makeRequest(host, uri, query, method, headers, (error, remoteResponse) => {
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

function createHeaders(options, content) {
  const accept = APPLICATION_JSON_CONTENT_TYPE,
        contentType = APPLICATION_X_WWW_FORM_ENCODED_CONTENT_TYPE,
        contentLength = content.length,
        basicAuthorisation = createBasicAuthorisation(options),
        authorization = basicAuthorisation, ///
        headers = {
          accept,
          authorization
        };

  headers[CONTENT_TYPE] = contentType;
  headers[CONTENT_LENGTH] = contentLength;

  return headers;
}

function createContent(options, code) {
  const query = createQuery(options, code),
        queryString = queryStringFromQuery(query),
        content = queryString;  ///

  return content;
}

function createQuery(options, code) {
  const { redirectURI } = options,
        grant_type = AUTHORIZATION_CODE,
        redirect_uri = redirectURI,  ///
        query = {
          code,
          grant_type,
          redirect_uri
        };

  return query;
}
