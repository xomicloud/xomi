"use strict";

const { CONTENT_TYPE, CONTENT_LENGTH } = require("../constants");

function createContentHeaders(request) {
  const contentHeaders = {},
        { headers } = request,
        ownPropertyNames = Object.getOwnPropertyNames(headers),
        names = ownPropertyNames,  ///
        lowerCaseContentType = CONTENT_TYPE.toLowerCase(),
        lowerCaseContentLength = CONTENT_LENGTH.toLowerCase();

  names.forEach((name) => {
    const value = headers[name],
          lowerCaseName = name.toLowerCase();

    if ((lowerCaseName === lowerCaseContentType) || (lowerCaseContentLength === CONTENT_LENGTH)) {
      contentHeaders[name] = value;
    }
  });

  return contentHeaders;
}

module.exports = {
  createContentHeaders
};
