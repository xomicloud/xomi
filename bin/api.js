"use strict";

const { requestUtilities } = require("necessary");

const { pipeline } = require("./utilities/pipeline"),
      { badGatewayError } = require("./http"),
      { DEFAULT_API_HOST } = require("./defaults"),
      { isRequestPostRequest } = require("./utilities/request"),
      { createBasicAuthorisation } = require("./utilities/authorisation"),
      { createContentHeaders, createAcceptHeaders } = require("./utilities/header");

const { request: remoteRequest } = requestUtilities;

function api(options, request, response) {
  const { url, query, method } = request,
        { apiHost = DEFAULT_API_HOST } = options,
        basicAuthorisation = createBasicAuthorisation(options),
        uri = url,  ///
        host = apiHost,  ///
        parameters = query, ///
        authorization = basicAuthorisation,  ///
        headers = {
          authorization
        },
        requestPostRequest = isRequestPostRequest(request);

  if (requestPostRequest) {
    const acceptHeaders = createAcceptHeaders(request),
          contentHeaders = createContentHeaders(request);

    Object.assign(headers, acceptHeaders, contentHeaders);
  }

  const _request = remoteRequest(host, uri, parameters, method, headers, (error, _response) => {
    if (error) {
      badGatewayError(response, error);

      return;
    }

    pipeline(_response, response);
  });

  request.pipe(_request);
}

module.exports = api;
