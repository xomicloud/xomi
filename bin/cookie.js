"use strict";

const { AUTHENTICATION, AUTHENTICATION_COOKIE_NAME_PREFIX } = require("./constants");

function setAuthenticationCookie(options, response, accessToken, rememberMe = false) {
  const authenticationCookieName = getAuthenticationCookieName(options),
        access_token = accessToken, ///
        json = {
          access_token
        },
        name = authenticationCookieName,  ///
        value = JSON.stringify(json),
        parameters = getParameters(options, rememberMe);

  response.cookie(name, value, parameters);
}

function removeAuthenticationCookie(options, response) {
  const authenticationCookieNAme = getAuthenticationCookieName(options),
        name = authenticationCookieNAme,  ///
        rememberMe = false,
        parameters = getParameters(options, rememberMe);

  response.clearCookie(name, parameters);
}

function isAuthenticationCookiePresent(options, request) {
  const { cookies } = request,
        authenticationCookieNAme = getAuthenticationCookieName(options),
        name = authenticationCookieNAme,  ///
        authenticationCookiePresent = !!cookies[name];

  return authenticationCookiePresent;
}

function getAccessTokenFromAuthenticationCookie(options, request) {
  let accessToken = null;

  const authenticationCookiePresent = isAuthenticationCookiePresent(options, request);

  if (authenticationCookiePresent) {
    const { cookies } = request,
          authenticationCookieNAme = getAuthenticationCookieName(options),
          name = authenticationCookieNAme,  ///
          value = cookies[name];

    try {
      const json = JSON.parse(value),
            { access_token } = json;

      accessToken = access_token; ///
    } catch (error) {
      accessToken = value;  ///
    }
  }

  return accessToken;
}

module.exports = {
  setAuthenticationCookie,
  removeAuthenticationCookie,
  isAuthenticationCookiePresent,
  getAccessTokenFromAuthenticationCookie
};

function getAuthenticationCookieName(options) {
  const { clientId } = options,
        authenticationCookieName = `${AUTHENTICATION}.${clientId}`;

  return authenticationCookieName;
}

function getParameters(options, rememberMe) {
  const parameters = {},
        { domain } = options;

  if (domain) {
    Object.assign(parameters, {
      domain
    });
  }

  if (rememberMe) {
    const expires = AUTHENTICATION_COOKIE_EXPIRES;

    Object.assign(parameters, {
      expires
    });
  }

  return parameters;
}
