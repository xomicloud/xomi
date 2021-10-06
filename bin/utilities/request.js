"use strict";

const { POST } = require("../constants");

function isRequestPostRequest(request) {
  const { method } = request,
        lowerCasePost = POST.toLowerCase(),
        lowerCaseMethod = method.toLowerCase(),
        methodPostMethod = (lowerCaseMethod === lowerCasePost),
        requestPostRequest = methodPostMethod;  ///

  return requestPostRequest;
}

module.exports = {
  isRequestPostRequest
};
