"use strict";

const { requestUtilities } = require("necessary");

const { POST } = require("./constants"),
      { pipeline } = require("./utilities/pipeline"),
      { badGatewayError } = require("./http"),
      { DEFAULT_API_HOST } = require("./defaults"),
      { createContentHeaders } = require("./utilities/content"),
      { createBasicAuthorisation } = require("./utilities/authorisation");

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
        lowerCasePost = POST.toLowerCase(),
        lowerCaseMethod = method.toLowerCase(),
        methodPostMethod = (lowerCaseMethod === lowerCasePost); ///

  if (methodPostMethod) {
    const contentHeaders = createContentHeaders(request);

    Object.assign(headers, contentHeaders);
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
