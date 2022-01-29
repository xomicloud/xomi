"use strict";

const { headers } = require("necessary");

const { ACCEPT_HEADER, CONTENT_TYPE_HEADER, CONTENT_LENGTH_HEADER } = headers;

function createAcceptHeaders(request) {
  const acceptHeaders = {},
        { headers } = request,
        lowerCaseAcceptHeader = ACCEPT_HEADER.toLowerCase();

  forEachLowerCaseNameAndValue(headers, (lowerCaseName, value) => {
    const lowerCaseNameStartsWithLowerCaseAccept = lowerCaseName.startsWith(lowerCaseAcceptHeader);

    if (lowerCaseNameStartsWithLowerCaseAccept) {
      acceptHeaders[lowerCaseName] = value;
    }
  });

  return acceptHeaders;
}

function createContentHeaders(request) {
  const contentHeaders = {},
        { headers } = request,
        lowerCaseContentTypeHeader = CONTENT_TYPE_HEADER.toLowerCase(),
        lowerCaseContentLengthHeader = CONTENT_LENGTH_HEADER.toLowerCase();

  forEachLowerCaseNameAndValue(headers, (lowerCaseName, value) => {
    if ((lowerCaseName === lowerCaseContentTypeHeader) || (lowerCaseName === lowerCaseContentLengthHeader)) {
      contentHeaders[lowerCaseName] = value;
    }
  });

  return contentHeaders;
}

module.exports = {
  createAcceptHeaders,
  createContentHeaders
};

function forEachLowerCaseNameAndValue(headers, callback) {
  const ownPropertyNames = Object.getOwnPropertyNames(headers),
        names = ownPropertyNames;  ///

  names.forEach((name) => {
    const value = headers[name],
          lowerCaseName = name.toLowerCase();

    callback(lowerCaseName, value);
  });
}
