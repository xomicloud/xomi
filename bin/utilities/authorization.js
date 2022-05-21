"use strict";

const { encodings } = require("necessary");

const { BASE64_ENCODING } = encodings;

function createBasicAuthorization(configuration) {
  const { clientId, clientSecret } = configuration,
        digest = `${clientId}:${clientSecret}`,
        encodedDigest = Buffer.from(digest).toString(BASE64_ENCODING),
        basicAuthorization = `Basic ${encodedDigest}`;

  return basicAuthorization;
}

module.exports = {
  createBasicAuthorization
};
