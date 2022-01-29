"use strict";

const { methods } = require("necessary");

const { EMPTY_STRING } = require("../constants");

const { POST_METHOD } = methods;

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
