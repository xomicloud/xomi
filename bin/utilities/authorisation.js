"use strict";

const { BASE_64 } = require("../constants");

function createBasicAuthorisationHeader(options) {
  const { clientId, clientSecret } = options,
        digest = `${clientId}:${clientSecret}`,
        encodedDigest = Buffer.from(digest).toString(BASE_64),
        basicAuthorisationHeader = `Basic ${encodedDigest}`;

  return basicAuthorisationHeader;
}

module.exports = {
  createBasicAuthorisationHeader
};
