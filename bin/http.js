"use strict";

const { headers, statusCodes, contentTypes } = require("necessary");

const { END, DATA, LOCATION, EMPTY_STRING } = require("./constants");

const { CONTENT_TYPE_HEADER } = headers,
      { OK_200_STATUS_CODE,
        SEE_OTHER_303_STATUS_CODE,
        NO_CONTENT_204_STATUS_CODE,
        UNAUTHORISED_401_STATUS_CODE,
        BAD_GATEWAY_ERROR_502_STATUS_CODE,
        INTERNAL_SERVER_ERROR_500_STATUS_CODE } = statusCodes,
      { TEXT_HTML_CONTENT_TYPE, TEXT_PLAIN_CONTENT_TYPE, APPLICATION_JSON_CONTENT_TYPE } = contentTypes;

function html(response, html) {
  response.setHeader(CONTENT_TYPE_HEADER, TEXT_HTML_CONTENT_TYPE);

  response.status(OK_200_STATUS_CODE);

  response.end(html);
}

function json(response, json) {
  json = JSON.stringify(json);  ///

  response.setHeader(CONTENT_TYPE_HEADER, APPLICATION_JSON_CONTENT_TYPE);

  response.status(OK_200_STATUS_CODE);

  response.end(json);
}

function redirect(response, location) {
  response.setHeader(LOCATION, location);

  response.status(SEE_OTHER_303_STATUS_CODE);

  response.end(EMPTY_STRING);
}

function plainText(response, text) {
  response.setHeader(CONTENT_TYPE_HEADER, TEXT_PLAIN_CONTENT_TYPE);

  response.status(OK_200_STATUS_CODE);

  response.end(text);
}

function noContent(response) {
  response.status(NO_CONTENT_204_STATUS_CODE);

  response.end();
}

function unauthorised(response) {
  response.status(UNAUTHORISED_401_STATUS_CODE);

  response.end();
}

function badGatewayError(response, error) {
  response.setHeader(CONTENT_TYPE_HEADER, TEXT_PLAIN_CONTENT_TYPE);

  response.status(BAD_GATEWAY_ERROR_502_STATUS_CODE);

  response.end(`${error}`); ///
}

function internalServerError(response, error) {
  response.setHeader(CONTENT_TYPE_HEADER, TEXT_PLAIN_CONTENT_TYPE);

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
  json,
  redirect,
  plainText,
  noContent,
  unauthorised,
  badGatewayError,
  internalServerError,
  contentFromResponse
};
