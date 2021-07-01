"use strict";

const { CONTENT_TYPE, CONTENT_LENGTH } = require("../constants");

function remoteHeadersFromRequest(request) {
  const remoteHeaders = {},
        { headers } = request,
        ownPropertyNames = Object.getOwnPropertyNames(headers),
        names = ownPropertyNames;  ///

  names.forEach((name) => {
    const value = headers[name],
          lowerCaseName = name.toLowerCase();

    if ((lowerCaseName === CONTENT_TYPE) || (lowerCaseName === CONTENT_LENGTH)) {
      remoteHeaders[name] = value;
    }
  });

  return remoteHeaders;
}

module.exports = {
  remoteHeadersFromRequest
};
