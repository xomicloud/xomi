"use strict";

import { END, DATA, LOCATION, EMPTY_STRING, CONTENT_TYPE } from "./constants";
import { TEXT_HTML_CONTENT_TYPE, TEXT_PLAIN_CONTENT_TYPE } from "./contentTypes";
import { OK_200_STATUS_CODE, SEE_OTHER_303_STATUS_CODE, INTERNAL_SERVER_ERROR_500_STATUS_CODE } from "./statusCodes";

export function html(response, html) {
  response.setHeader(CONTENT_TYPE, TEXT_HTML_CONTENT_TYPE);

  response.status(OK_200_STATUS_CODE);

  response.end(html);
}

export function redirect(response, location) {
  response.setHeader(LOCATION, location);

  response.status(SEE_OTHER_303_STATUS_CODE);

  response.end(EMPTY_STRING);
}

export function bodyFromResponse(response, callback) {
  let body = "";

  response.on(DATA, (data) => {
    body += data;
  });

  response.on(END, () => {
    callback(body);
  });
}

export function internalServerError(response, error) {
  response.setHeader(CONTENT_TYPE, TEXT_PLAIN_CONTENT_TYPE);

  response.status(INTERNAL_SERVER_ERROR_500_STATUS_CODE);

  response.end(error);
}

export default {
  html,
  redirect,
  bodyFromResponse,
  internalServerError
};
