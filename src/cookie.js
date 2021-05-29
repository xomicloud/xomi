"use strict";

import { AUTHENTICATION_COOKIE_EXPIRES, AUTHENTICATION_COOKIE_NAME_PREFIX } from "./constants";

function setAuthenticationCookie(options, response, accessToken, rememberMe = false) {
  const authenticationCookieName = getAuthenticationCookieName(options),
        json = {
          accessToken
        },
        name = authenticationCookieName,  ///
        value = JSON.stringify(json),
        parameters = getParameters(rememberMe);

  response.cookie(name, value, parameters);
}

function removeAuthenticationCookie(options, response) {
  const authenticationCookieNAme = getAuthenticationCookieName(options),
        name = authenticationCookieNAme;  ///

  response.clearCookie(name);
}

function isAuthenticationCookiePresent(options, request) {
  const { cookies } = request,
        authenticationCookieNAme = getAuthenticationCookieName(options),
        name = authenticationCookieNAme,  ///
        authenticationCookiePresent = !!cookies[name];

  return authenticationCookiePresent;
}

module.exports = {
  setAuthenticationCookie,
  removeAuthenticationCookie,
  isAuthenticationCookiePresent
};

function getAuthenticationCookieName(options) {
  const { clientId } = options,
        authenticationCookieName = `${AUTHENTICATION_COOKIE_NAME_PREFIX}.${clientId}`;

  return authenticationCookieName;
}

function getParameters(rememberMe) {
  const parameters = {};

  if (rememberMe) {
    const expires = AUTHENTICATION_COOKIE_EXPIRES;

    Object.assign(parameters, {
      expires
    });
  }

  return parameters;
}
