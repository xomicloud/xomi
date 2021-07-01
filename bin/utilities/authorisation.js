"use strict";

const { arrayUtilities } = require("necessary");

const { BASE_64 } = require("../constants");

const { second, third } = arrayUtilities;

function createBasicAuthorisation(options) {
  const { clientId, clientSecret } = options,
        digest = `${clientId}:${clientSecret}`,
        encodedDigest = Buffer.from(digest).toString(BASE_64),
        basicAuthorisation = `Basic ${encodedDigest}`;

  return basicAuthorisation;
}

function clientIdFromBasicAuthorisation(basicAuthorisation) {
  let clientId = null;

  const digest = digestFromBasicAuthorisation(basicAuthorisation),
        matches = digest.match(/^([^:]+):([^:]+)$/);

  if (matches !== null) {
    const secondMatch = second(matches);

    clientId = secondMatch;  ///
  }

  return clientId;
}

function clientSecretFromBasicAuthorisation(basicAuthorisation) {
  let clientSecret = null;

  const digest = digestFromBasicAuthorisation(basicAuthorisation),
        matches = digest.match(/^([^:]+):([^:]+)$/);

  if (matches !== null) {
    const thirdMatch = third(matches);

    clientSecret = thirdMatch;  ///
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

    digest = Buffer.from(encodedDigest, BASE_64).toString();
  }

  return digest;
}
