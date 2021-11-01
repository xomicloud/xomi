"use strict";

const { TRANSFER_ENCODING } = require("../constants");

function pipeline(remoteResponse, response, content = null) {
  setStatus(remoteResponse, response);

  setHeaders(remoteResponse, response);

  (content === null) ?
    remoteResponse.pipe(response) :
      response.send(content);
}

function setStatus(remoteResponse, response) {
  const { statusCode } = remoteResponse;

  response.status(statusCode);
}

function setHeaders(remoteResponse, response) {
  const { headers } = remoteResponse;

  for (const name in headers) {
    const lowerCaseName = name.toLowerCase(),
          lowerCaseTransferEncoding = TRANSFER_ENCODING.toLowerCase();

    if (lowerCaseName !== lowerCaseTransferEncoding) {
      const value = headers[name];

      response.setHeader(name, value);
    }
  }
}

module.exports = {
  pipeline,
  setStatus,
  setHeaders
};
