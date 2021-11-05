"use strict";

const { TRANSFER_ENCODING } = require("../constants");

function setStatus(remoteResponse, response) {
  const { statusCode } = remoteResponse;

  response.status && response.status(statusCode); ///
}

function setHeaders(remoteResponse, response) {
  const { headers } = remoteResponse;

  for (const name in headers) {
    const lowerCaseName = name.toLowerCase(),
          lowerCaseTransferEncoding = TRANSFER_ENCODING.toLowerCase();

    if (lowerCaseName !== lowerCaseTransferEncoding) {
      const value = headers[name];

      response.setHeader && response.setHeader(name, value);  ///
    }
  }
}

module.exports = {
  setStatus,
  setHeaders
};
