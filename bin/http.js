"use strict";

const { END, DATA, LOCATION, EMPTY_STRING, CONTENT_TYPE } = require("./constants"),
      { TEXT_HTML_CONTENT_TYPE, TEXT_PLAIN_CONTENT_TYPE } = require("./contentTypes"),
      { OK_200_STATUS_CODE, SEE_OTHER_303_STATUS_CODE, BAD_GATEWAY_ERROR_502_STATUS_CODE, INTERNAL_SERVER_ERROR_500_STATUS_CODE } = require("./statusCodes");

function html(response, html) {
  response.setHeader(CONTENT_TYPE, TEXT_HTML_CONTENT_TYPE);

  response.status(OK_200_STATUS_CODE);

  response.end(html);
}

function redirect(response, location) {
  response.setHeader(LOCATION, location);

  response.status(SEE_OTHER_303_STATUS_CODE);

  response.end(EMPTY_STRING);
}

function plainText(response, text) {
  response.setHeader(CONTENT_TYPE, TEXT_PLAIN_CONTENT_TYPE);

  response.status(OK_200_STATUS_CODE);

  response.end(text);
}

function badGatewayError(response, error) {
  response.setHeader(CONTENT_TYPE, TEXT_PLAIN_CONTENT_TYPE);

  response.status(BAD_GATEWAY_ERROR_502_STATUS_CODE);

  response.end(`${error}`); ///
}

function internalServerError(response, error) {
  response.setHeader(CONTENT_TYPE, TEXT_PLAIN_CONTENT_TYPE);

  response.status(INTERNAL_SERVER_ERROR_500_STATUS_CODE);

  response.end(`${error}`); ///
}

function contentFromResponse(response, callback) {
  let content = EMPTY_STRING;

  response.on(DATA, (data) => {
    content += data;
  });

  response.on(END, () => {
    callback(content);
  });
}

module.exports = {
  html,
  redirect,
  plainText,
  badGatewayError,
  internalServerError,
  contentFromResponse
};
