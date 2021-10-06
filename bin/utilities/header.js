"use strict";

const { ACCEPT, CONTENT_TYPE, CONTENT_LENGTH } = require("../constants");

function createAcceptHeaders(request) {
  const acceptHeaders = {},
        { headers } = request,
        lowerCaseAccept = ACCEPT.toLowerCase();

  forEachLowerCaseNameAndValue(headers, (lowerCaseName, value) => {
    const lowerCaseNameStartsWithLowerCaseAccept = lowerCaseName.startsWith(lowerCaseAccept);

    if (lowerCaseNameStartsWithLowerCaseAccept) {
      acceptHeaders[lowerCaseName] = value;
    }
  });

  return acceptHeaders;
}

function createContentHeaders(request) {
  const contentHeaders = {},
        { headers } = request,
        lowerCaseContentType = CONTENT_TYPE.toLowerCase(),
        lowerCaseContentLength = CONTENT_LENGTH.toLowerCase();

  forEachLowerCaseNameAndValue(headers, (lowerCaseName, value) => {
    if ((lowerCaseName === lowerCaseContentType) || (lowerCaseName === lowerCaseContentLength)) {
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
