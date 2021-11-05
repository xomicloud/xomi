"use strict";

const { pipeline } = require("stream"),
      { requestUtilities } = require("necessary");

const { badGatewayError } = require("./http"),
      { DEFAULT_API_HOST } = require("./defaults"),
      { setStatus, setHeaders } = require("./utilities/response"),
      { createBasicAuthorisation } = require("./utilities/authorisation"),
      { uriFromURL, isMethodPostMethod } = require("./utilities/request"),
      { createContentHeaders, createAcceptHeaders } = require("./utilities/header");

const { request: makeRequest } = requestUtilities;

function api(options, request, response, callback = null) {
  const { url, query, method } = request,
        { apiHost = DEFAULT_API_HOST } = options,
        basicAuthorisation = createBasicAuthorisation(options),
        uri = uriFromURL(url),
        host = apiHost,  ///
        parameters = query, ///
        authorization = basicAuthorisation,  ///
        headers = {
          authorization
        },
        methodPostMethod = isMethodPostMethod(method);

  if (methodPostMethod) {
    const acceptHeaders = createAcceptHeaders(request),
          contentHeaders = createContentHeaders(request);

    Object.assign(headers, acceptHeaders, contentHeaders);
  }

  const remoteRequest = makeRequest(host, uri, parameters, method, headers, (error, remoteResponse) => {
    if (error) {
      badGatewayError(response, error);

      return;
    }

    setStatus(remoteResponse, response);

    setHeaders(remoteResponse, response);

    if (callback !== null) {
      callback();
    }

    pipeline(remoteResponse, response, (error) => {
      ///
    });
  });

  pipeline(request, remoteRequest, (error) => {
    ///
  });
}

module.exports = api;
