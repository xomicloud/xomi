"use strict";

import { Readable } from "stream";
import { httpUtilities, requestUtilities } from "necessary";

import http from "./http";

import { APPLICATION_JSON_CONTENT_TYPE, APPLICATION_X_WWW_FORM_ENCODED_CONTENT_TYPE } from "./contentTypes";
import { BASE_64,
         EMPTY_STRING,
         CONTENT_TYPE,
         OPEN_ID_SCOPE,
         CONTENT_LENGTH,
         CODE_RESPONSE_TYPE,
         AUTHORIZATION_CODE_GRANT_TYPE } from "./constants";

const { post } = requestUtilities,
      { queryStringFromParameters } = httpUtilities;

function redirect(options, response, createAccount = false) {
  const { clientHost, clientId, redirectURI, state = null, additionalParameters = null } = options,
        scope = OPEN_ID_SCOPE,  ///
        client_id = clientId,  ///
        redirect_uri = redirectURI,  ///
        response_type = CODE_RESPONSE_TYPE, ///
        parameters = {
          scope,
          client_id,
          redirect_uri,
          response_type
        };

  if (state) {
    Object.assign(parameters, {
      state
    });
  }

  if (createAccount) {
    const create_account = createAccount; ///

    Object.assign(parameters, {
      create_account
    });
  }

  if (additionalParameters) {
    Object.assign(parameters, additionalParameters);
  }

  const queryString = queryStringFromParameters(parameters),
        location = `${clientHost}?${queryString}`;

  http.redirect(response, location);
}

function callback(options, code, callback) {
  const { clientHost } = options,
        content = createContent(options, code),
        headers = createHeaders(options, content),
        host = clientHost,  ///
        uri = EMPTY_STRING, ///
        parameters = {},  ///
        readable = Readable.from(content);

  readable.pipe(post(host, uri, parameters, headers, (error, remoteResponse) => {
    let accessToken = null,
        refreshToken = null;

    if (error) {
      callback(error, accessToken, refreshToken);

      return;
    }

    http.bodyFromResponse(remoteResponse, (body) => {
      let json;

      const jsonString = body;  ///

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
  }));
}

export default {
  redirect,
  callback
};

function createHeaders(options, content) {
  const { clientId, clientSecret } = options,
        digest = `${clientId}:${clientSecret}`,
        encodedDigest = Buffer.from(digest).toString(BASE_64),
        accept = APPLICATION_JSON_CONTENT_TYPE,
        contentType = APPLICATION_X_WWW_FORM_ENCODED_CONTENT_TYPE,
        contentLength = content.length,
        authorization = `Basic ${encodedDigest}`,
        headers = {
          accept,
          authorization
        };

  headers[CONTENT_TYPE] = contentType;
  headers[CONTENT_LENGTH] = contentLength;

  return headers;
}

function createContent(options, code) {
  const parameters = createParameters(options, code),
        queryString = queryStringFromParameters(parameters),
        content = queryString;  ///

  return content;
}

function createParameters(options, code) {
  const { redirectURI } = options,
        grant_type = AUTHORIZATION_CODE_GRANT_TYPE,
        redirect_uri = redirectURI,  ///
        parameters = {
          code,
          grant_type,
          redirect_uri
        };

  return parameters;
}
