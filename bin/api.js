"use strict";

const { requestUtilities } = require("necessary");

const { pipeline } = require("./utilities/pipeline"),
      { badGatewayError } = require("./http"),
      { DEFAULT_API_HOST } = require("./defaults"),
      { createBasicAuthorisation } = require("./utilities/authorisation"),
      { uriFromURL, isMethodPostMethod } = require("./utilities/request"),
      { createContentHeaders, createAcceptHeaders } = require("./utilities/header");

const { request: remoteRequest } = requestUtilities;

function api(options, request, response) {
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

  request.pipe(remoteRequest(host, uri, parameters, method, headers, (error, remoteResponse) => {
    if (error) {
      badGatewayError(response, error);

      return;
    }

    pipeline(remoteResponse, response);
  }));
}

module.exports = api;
