"use strict";

const { headers, statusCodes, contentTypes } = require("necessary");

const { EMPTY_STRING } = require("./constants");

const { TEXT_PLAIN_CONTENT_TYPE } = contentTypes,
      { LOCATION_HEADER, CONTENT_TYPE_HEADER } = headers,
      { SEE_OTHER_303_STATUS_CODE, BAD_GATEWAY_ERROR_502_STATUS_CODE } = statusCodes;

function redirect(response, location) {
  response.setHeader(LOCATION_HEADER, location);

  response.status(SEE_OTHER_303_STATUS_CODE);

  response.end(EMPTY_STRING);
}

function badGatewayError(response, error) {
  response.setHeader(CONTENT_TYPE_HEADER, TEXT_PLAIN_CONTENT_TYPE);

  response.status(BAD_GATEWAY_ERROR_502_STATUS_CODE);

  response.end(`${error}`); ///
}

module.exports = {
  redirect,
  badGatewayError
};
