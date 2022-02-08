# Xomi

Secure functionality for Xomi.

## Installation

You can install Xomi with [npm](https://www.npmjs.com/):

    npm install @xomicloud/xomi

You can also clone the repository with [Git](https://git-scm.com/)...

    git clone https://github.com/xomicloud/xomi.git

...and then install the dependencies with npm from within the project's root directory:

    npm install

You only need to do this if you are interested in Xomi's development, however.

## Usage

All of the functions take a plain old JavaScript object as their first `configuration` argument, the properties of which must be the client configuration. If you are using the standard set of environment variables then the following will return the required object:

```
"use strict";

const { CLIENT_HOST, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env,
      clientId = CLIENT_ID, ///
      clientHost = CLIENT_HOST, ///
      clientSecret = CLIENT_SECRET, ///
      redirectURI = REDIRECT_URI; ///

module.exports = {
  clientId,
  clientHost,
  clientSecret,
  redirectURI
};
```
You invoke the functions as follows:

```
const { oAuth, cookie } = require("@xomicloud/xomi");

const configuration = require("../configuration");

oAuth.callback(configuration, ...); //  Make an OAuth callback

cookie.setAuthenticationCookie(configuration, ...)  //  Set an authentication cookie
```

Note the use of the aforementioned `configuration` argument which is assumed to be returned as described above.

### OAuth

- `redirect()`
- `callback()`

These functions will redirect the browser to the Xomi authentication site and handle the subsequent callback, respectively. Usage examples can be found in the [JavaScript secure application](https://github.com/xomicloud/javascript-secure-application).

* The `redirect()` function takes `configuration` and `response` arguments. The response is expected to be an instance of Node's [ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse) class. You can also pass a third, optional `createAccount` argument that, if set to true, instructs the authentication site to show the form to create an account rather than the sign up form.

```
const { oAuth } = require("@xomicloud/xomi");

const configuration = require("../configuration");

function signInHandler(request, response, next) {
  const createAccount = false;

  oAuth.redirect(configuration, response, createAccount);
}
```

* The `callback()` function takes `configuration`, `code` and `callback` function arguments. The `code` argument is the code returned by the authentication site when the user successfully authenticates and can be recovered from the request object, assuming it is an instance of Node's [IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) class. The callback function should accept an `error` and an `accessToken` argument.

```
const { oAuth, cookie } = require("@xomicloud/xomi");

const configuration = require("../configuration");

function callbackHandler(request, response, next) {
  const { query } = request,
        { code } = query;

  oAuth.callback(configuration, code, (error, accessToken) => {
    ///
  });
}
```

### Cookies

- `setAuthenticationCookie()`
- `removeAuthenticationCookie()`
- `isAuthenticationCookiePresent()`
- `getAccessTokenFromAuthenticationCookie()`
- `getIdentityTokenFromAuthenticationCookie()`

These functions supply basic authentication cookie functionality. Usage examples can again be found in the JavaScript secure application.

* The `setAuthenticationCookie()` function takes `configuration`, `response`, `accessToken` and `identityToken` arguments. The response is expected to be an instance of Node's ServerResponse class. It also takes an optional `rememberMe` argument which, if set to true, sets the expiry of the cookie well into the future.

```
const { oAuth, cookie } = require("@xomicloud/xomi");

const configuration = require("../configuration");

function callbackHandler(request, response, next) {
  const { query } = request,
        { code } = query;

  oAuth.callback(configuration, code, (error, accessToken, refreshToken, identityToken) => {
    ///

    const { remember_me } = query,
          rememberMe = !!remember_me;

    cookie.setAuthenticationCookie(configuration, response, accessToken, identityToken, rememberMe);

    ///
  });
}
```

Note that the refresh token returned from the `oAuth.callback()` function, which will likely be null, is not saved in the authentication cookie.

* The `removeAuthenticationCookie()` function takes `configuration` and `response` arguments.

```
const { cookie, oAuth } = require("@xomicloud/xomi");

const configuration = require("../configuration");

function signOutHandler(request, response, next) {
  cookie.removeAuthenticationCookie(configuration, response);

  oAuth.redirect(configuration, response);
}
```

* The `isAuthenticationCookiePresent()` function takes `configuration` and `response` arguments.

```
const { oAuth, cookie } = require("@xomicloud/xomi");

const configuration = require("../../configuration");

function homePageHandler(request, response, next) {
  const authenticationCookiePresent = cookie.isAuthenticationCookiePresent(configuration, request);

  if (!authenticationCookiePresent) {
    oAuth.redirect(configuration, response);

    return;
  }

  ///
}
```

* The `getAccessTokenFromAuthenticationCookie()` function similarly takes `configuration` and `response` arguments. It returns an access token if the authentication cookie exists and can be parsed, `null` otherwise.

* The `getIdentityTokenFromAuthenticationCookie()` function similarly takes `configuration` and `response` arguments. It returns an identity token if the authentication cookie exists and can be parsed, `null` otherwise.

### Integrations

- `api()`

There is only one function that connects to Xomi's API server. Only an outline of its usage is given here. More detailed information can be found in the integration tutorial, a link to which is in the related links section immediately below.

* The `api` function takes `configuration`, `request` and `response` objects:
 
```
api(configuration, request, response);
```

In this instance the `request` and `response` objects do not have to be instances of Node's IncomingMessage and ServerResponse classes and can be hand rolled. Again, see the tutorial for more details.

## Related links

* [GitHub - JavaScript Secure Application](https://github.com/xomicloud/javascript-secure-application)
* [Developers - JavaScript Lambda Tutorial](https://developers.xomi.cloud/tutorial/javascript-lambda)
* [Developers - JavaScript localhost Tutorial](https://developers.xomi.cloud/tutorial/javascript-localhost)
* [Developers - Google Drive Integrations Tutorial](https://developers.xomi.cloud/tutorial/google-drive-integration)
* [Knowledge base - The Anatomy of a Secure Application](https://developers.xomi.cloud/knowledge-base/anatomy-of-secure-application)

## Contact

- james.smith@djalbat.com
