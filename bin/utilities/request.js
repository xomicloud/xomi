"use strict";

const { POST, EMPTY_STRING } = require("../constants");

function uriFromURL(url) {
  const uri = url.replace(/\?.*/, EMPTY_STRING);

  return uri;
}

function isMethodPostMethod(method) {
  const lowerCasePost = POST.toLowerCase(),
        lowerCaseMethod = method.toLowerCase(),
        methodPostMethod = (lowerCaseMethod === lowerCasePost);

  return methodPostMethod;
}

module.exports = {
  uriFromURL,
  isMethodPostMethod
};
