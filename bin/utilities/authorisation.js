"use strict";

const { BASE_64 } = require("../constants");

function createBasicAuthorisation(options) {
  const { clientId, clientSecret } = options,
        digest = `${clientId}:${clientSecret}`,
        encodedDigest = Buffer.from(digest).toString(BASE_64),
        basicAuthorisation = `Basic ${encodedDigest}`;

  return basicAuthorisation;
}

module.exports = {
  createBasicAuthorisation
};
