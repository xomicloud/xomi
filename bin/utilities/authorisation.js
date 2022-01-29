"use strict";

const { encodings, arrayUtilities } = require("necessary");

const { second, third } = arrayUtilities;

const { BASE64_ENCODING } = encodings;

function createBasicAuthorisation(options) {
  const { clientId, clientSecret } = options,
        digest = `${clientId}:${clientSecret}`,
        encodedDigest = Buffer.from(digest).toString(BASE64_ENCODING),
        basicAuthorisation = `Basic ${encodedDigest}`;

  return basicAuthorisation;
}

function clientIdFromBasicAuthorisation(basicAuthorisation) {
  let clientId = null;

  if (basicAuthorisation !== null) {
    const digest = digestFromBasicAuthorisation(basicAuthorisation),
          matches = digest.match(/^([^:]+):([^:]+)$/);

    if (matches !== null) {
      const secondMatch = second(matches);

      clientId = secondMatch;  ///
    }
  }

  return clientId;
}

function clientSecretFromBasicAuthorisation(basicAuthorisation) {
  let clientSecret = null;

  if (basicAuthorisation !== null) {
    const digest = digestFromBasicAuthorisation(basicAuthorisation),
          matches = digest.match(/^([^:]+):([^:]+)$/);

    if (matches !== null) {
      const thirdMatch = third(matches);

      clientSecret = thirdMatch;  ///
    }
  }

  return clientSecret;
}

module.exports = {
  createBasicAuthorisation,
  clientIdFromBasicAuthorisation,
  clientSecretFromBasicAuthorisation
};

function digestFromBasicAuthorisation(basicAuthorisation) {
  let digest = null;

  const matches = basicAuthorisation.match(/^Basic (.+)$/i);

  if (matches !== null) {
    const secondMatch = second(matches),
          encodedDigest = secondMatch;  ///

    digest = Buffer.from(encodedDigest, BASE64_ENCODING).toString();
  }

  return digest;
}
