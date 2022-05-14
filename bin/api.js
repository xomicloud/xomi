"use strict";

const { requestUtilities } = require("necessary");

const httpResponse = require("./httpResponse");

const { AUTHORIZATION } = require("./constants"),
      { DEFAULT_API_HOST } = require("./hosts"),
      { setStatus, setHeaders } = require("./utilities/response"),
      { createBasicAuthorisation } = require("./utilities/authorisation");

const { createRequest: createRemoteRequest } = requestUtilities;

function api(configuration, request, response) {
  const { apiHost = DEFAULT_API_HOST } = configuration,
        { uri, query, method, headers } = request,
        basicAuthorisation = createBasicAuthorisation(configuration),
        authorization = basicAuthorisation,  ///
        host = apiHost;  ///

  headers[AUTHORIZATION] = authorization;

  const remoteRequest = createRemoteRequest(host, uri, query, method, headers, (error, remoteResponse) => {
    if (error) {
      httpResponse.badGatewayError(response, error);

      return;
    }

    setStatus(remoteResponse, response);

    setHeaders(remoteResponse, response);

    remoteResponse.pipe(response);
  });

  request.pipe(remoteRequest);
}

module.exports = api;
