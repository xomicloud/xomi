"use strict";

const { AUTHENTICATION, AUTHENTICATION_COOKIE_EXPIRES } = require("./constants");

function setAuthenticationCookie(configuration, response, accessToken, rememberMe = false) {
  const authenticationCookieName = getAuthenticationCookieName(configuration),
        access_token = accessToken, ///
        json = {
          access_token
        },
        name = authenticationCookieName,  ///
        value = JSON.stringify(json),
        parameters = getParameters(configuration, rememberMe);

  response.cookie(name, value, parameters);
}

function removeAuthenticationCookie(configuration, response) {
  const authenticationCookieNAme = getAuthenticationCookieName(configuration),
        name = authenticationCookieNAme,  ///
        rememberMe = false,
        parameters = getParameters(configuration, rememberMe);

  response.clearCookie(name, parameters);
}

function isAuthenticationCookiePresent(configuration, request) {
  const { cookies } = request,
        authenticationCookieNAme = getAuthenticationCookieName(configuration),
        name = authenticationCookieNAme,  ///
        authenticationCookiePresent = !!cookies[name];

  return authenticationCookiePresent;
}

function getAccessTokenFromAuthenticationCookie(configuration, request) {
  let accessToken = null;

  const authenticationCookiePresent = isAuthenticationCookiePresent(configuration, request);

  if (authenticationCookiePresent) {
    const { cookies } = request,
          authenticationCookieNAme = getAuthenticationCookieName(configuration),
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

function getAuthenticationCookieName(configuration) {
  const { clientId } = configuration,
        authenticationCookieName = `${AUTHENTICATION}.${clientId}`;

  return authenticationCookieName;
}

function getParameters(configuration, rememberMe) {
  const parameters = {},
        { domain } = configuration;

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
