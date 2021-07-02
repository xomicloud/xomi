"use strict";

const { requestUtilities } = require("necessary");

const { pipeline } = require("./utilities/pipeline"),
      { createContentHeaders } = require("./utilities/content"),
      { createBasicAuthorisation } = require("./utilities/authorisation");

const { POST_METHOD } = require("./constants"),
      { DEFAULT_API_HOST } = require("./defaults");

const { request: remoteRequest } = requestUtilities;

function api(options, request, response) {
  const { url, query, method, apiHost = DEFAULT_API_HOST } = request,
        basicAuthorisation = createBasicAuthorisation(options),
        authorization = basicAuthorisation,  ///
        host = apiHost,  ///
        uri = url,  ///
        parameters = query, ///
        headers = {
          authorization
        };

  if (method === POST_METHOD) {
    const contentHeaders = createContentHeaders(request);

    Object.assign(headers, contentHeaders);
  }

  const _request = remoteRequest(host, uri, parameters, method, headers, (error, _response) => {
    if (error) {
      debugger

      return;
    }

    pipeline(_response, response);
  });

  request.pipe(_request);
}

module.exports = api;
