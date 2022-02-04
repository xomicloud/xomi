"use strict";

const { headers } = require("necessary");

const { END, DATA, EMPTY_STRING } = require("../constants");

const { TRANSFER_ENCODING_HEADER } = headers;

function setStatus(remoteResponse, response) {
  const { statusCode } = remoteResponse;

  response.status(statusCode);
}

function setHeaders(remoteResponse, response) {
  const { headers } = remoteResponse;

  for (const name in headers) {
    const lowerCaseName = name.toLowerCase(),
          lowerCaseTransferEncodingHeader = TRANSFER_ENCODING_HEADER.toLowerCase();

    if (lowerCaseName !== lowerCaseTransferEncodingHeader) {
      const value = headers[name];

      response.setHeader(name, value);  ///
    }
  }
}

function contentFromResponse(response, callback) {
  let content = EMPTY_STRING;

  response.on(DATA, (data) => {
    content += data;
  });

  response.on(END, () => {
    callback(content);
  });
}

module.exports = {
  setStatus,
  setHeaders,
  contentFromResponse
};
