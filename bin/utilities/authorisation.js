"use strict";

const { encodings } = require("necessary");

const { BASE64_ENCODING } = encodings;

function createBasicAuthorisation(configuration) {
  const { clientId, clientSecret } = configuration,
        digest = `${clientId}:${clientSecret}`,
        encodedDigest = Buffer.from(digest).toString(BASE64_ENCODING),
        basicAuthorisation = `Basic ${encodedDigest}`;

  return basicAuthorisation;
}

module.exports = {
  createBasicAuthorisation
};
