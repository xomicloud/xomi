"use strict";

const { requestUtilities } = require("necessary");

const { badGatewayError } = require("./http"),
      { DEFAULT_API_HOST } = require("./defaults"),
      { setStatus, setHeaders } = require("./utilities/response"),
      { createBasicAuthorisation } = require("./utilities/authorisation"),
      { uriFromURL, isMethodPostMethod } = require("./utilities/request"),
      { createContentHeaders, createAcceptHeaders } = require("./utilities/header");

const { createRequest: createRemoteRequest } = requestUtilities;

function api(configuration, request, response, callback = null) {
  const { url, query, method } = request,
        { apiHost = DEFAULT_API_HOST } = configuration,
        basicAuthorisation = createBasicAuthorisation(configuration),
        uri = uriFromURL(url),
        host = apiHost,  ///
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

  const remoteRequest = createRemoteRequest(host, uri, query, method, headers, (error, remoteResponse) => {
    if (error) {
      badGatewayError(response, error);

      return;
    }

    setStatus(remoteResponse, response);

    setHeaders(remoteResponse, response);

    if (callback !== null) {
      callback();
    }

    remoteResponse.pipe(response);
  });

  request.pipe(remoteRequest);
}

module.exports = api;
