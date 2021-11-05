"use strict";

const { POST_METHOD } = require("../methods"),
      { EMPTY_STRING } = require("../constants");

function uriFromURL(url) {
  const uri = url.replace(/\?.*/, EMPTY_STRING);

  return uri;
}

function isMethodPostMethod(method) {
  const lowerCaseMethod = method.toLowerCase(),
        lowerCasePostMethod = POST_METHOD.toLowerCase(),
        methodPostMethod = (lowerCaseMethod === lowerCasePostMethod);

  return methodPostMethod;
}

module.exports = {
  uriFromURL,
  isMethodPostMethod
};
