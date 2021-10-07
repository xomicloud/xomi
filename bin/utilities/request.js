"use strict";

const { POST, EMPTY_STRING } = require("../constants");

function uriFromURL(url) {
  const uri = url.replace(/\?.*/, EMPTY_STRING);

  return uri;
}

function isRequestPostRequest(request) {
  const { method } = request,
        lowerCasePost = POST.toLowerCase(),
        lowerCaseMethod = method.toLowerCase(),
        methodPostMethod = (lowerCaseMethod === lowerCasePost),
        requestPostRequest = methodPostMethod;  ///

  return requestPostRequest;
}

module.exports = {
  uriFromURL,
  isRequestPostRequest
};
