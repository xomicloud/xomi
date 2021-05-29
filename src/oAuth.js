"use strict";

import { Readable } from "stream";
import { httpUtilities, requestUtilities } from "necessary";

import http from "./http";

import { APPLICATION_JSON_CONTENT_TYPE, APPLICATION_X_WWW_FORM_ENCODED_CONTENT_TYPE } from "./contentTypes";
import { ROOT_URI, BASE_64, EMPTY_STATE, OPEN_ID_SCOPE, CODE_RESPONSE_TYPE, AUTHORIZATION_CODE_GRANT_TYPE } from "./constants";

const { post } = requestUtilities,
      { queryStringFromParameters } = httpUtilities;

function redirect(options, response, createAccount = false) {
  const { clientId, clientHost, redirectURI } = options,
        state = EMPTY_STATE, ///
        scope = OPEN_ID_SCOPE,  ///
        client_id = clientId,  ///
        redirect_uri = redirectURI,  ///
        response_type = CODE_RESPONSE_TYPE, ///
        parameters = {
          "state" : state,
          "scope" : scope,
          "client_id" : client_id,
          "redirect_uri" : redirect_uri,
          "response_type" : response_type
        };

  if (createAccount) {
    const create_account = createAccount; ///

    Object.assign(parameters, {
      "create_account": create_account
    });
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
        uri = ROOT_URI,
        parameters = {},  ///
        readable = Readable.from(content);

  readable.pipe(post(host, uri, parameters, headers, (error, remoteResponse) => {
    let accessToken = null;

    if (error) {
      callback(error, accessToken);

      return;
    }

    http.bodyFromResponse(remoteResponse, (body) => {
      let json;

      const jsonString = body;  ///

      try {
        json = JSON.parse(jsonString);
      } catch (error) {
        callback(error, accessToken);

        return;
      }

      const { access_token = null} = json;

      accessToken = access_token; ///

      callback(error, accessToken);
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
        authorisation = `Basic ${encodedDigest}`,
        headers = {
          "accept" : accept,
          "content-type" : contentType,
          "content-length" : contentLength,
          "authorization" : authorisation ///
        };

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
          "code" : code,
          "grant_type" : grant_type,
          "redirect_uri" : redirect_uri
        };

  return parameters;
}
