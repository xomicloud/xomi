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

All of the functions take a plain old JavaScript object as their first `configuration` argument, the properties of which must be the client configuration. If you are using the standard set of environment variables then the following code snippet will return the required object:

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

const configuration = require("configuration");

oAuth.callback(configuration, ...); //  Make an OAuth callback

cookie.setAuthenticationCookie(configuration, ...)  //  Set an authentication cookie
```

Note the use of the aforementioned `configuration` argument.

### OAuth functionality

- `redirect()`
- `callback()`

These functions will redirect the browser to the Xomi authentication site and handle the subsequent callback. Full usage examples can be found in the JavaScript secure application, a link to which can be found in the related links section near the foot of this readme file.

* The `redirect()` function takes an `option` argument and a `response` argument. The response is expected to be an instance of Node's [ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse) class. You can also pass a third, optional `createAccount` argument that, if set to true, instructs the authentication site to show the form to create an account rather than the sign up form.

```
const { oAuth } = require("@xomicloud/xomi");

const configuration = require("../configuration");

function signInHandler(request, response, next) {
  const createAccount = false;

  oAuth.redirect(configuration, response, createAccount);
}
```

* The `callback()` function takes an `option` argument, a `code` argument and a `callback` function argument. The `code` argument is expected to be the code returned by the authentication site when the user successfully authenticates and can be recovered from the request object, assuming it is an instance of Node's [IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) class. The callback function should accept an `error` and an `accessToken` argument.

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

### Cookie functionality

- `setAuthenticationCookie()`
- `removeAuthenticationCookie()`
- `isAuthenticationCookiePresent()`
- `getAccessTokenFromAuthenticationCookie()`

These functions supply basic authentication cookie functionality. Full usage examples can be found in the JavaScript secure application, a link to which can be found in the related links section near the foot of this readme file.

* The `setAuthenticationCookie()` function takes an `option` argument, a `response` argument and an `accessToken` argument. The response is expected to be an instance of Node's ServerResponse class. It also takes an optional `rememberMe` argument which, if est to true, sets the expiry of the cookie well into the future.

```
const { oAuth, cookie } = require("@xomicloud/xomi");

const configuration = require("../configuration");

function callbackHandler(request, response, next) {
  const { query } = request,
        { code } = query;

  oAuth.callback(configuration, code, (error, accessToken) => {
    ///

    const { remember_me } = query,
          rememberMe = !!remember_me;

    cookie.setAuthenticationCookie(configuration, response, accessToken, rememberMe);

    ///
  });
}
```

* The `removeAuthenticationCookie()` function takes an `option` argument and a `response` argument.

```
const { cookie, oAuth } = require("@xomicloud/xomi");

const configuration = require("../configuration");

function signOutHandler(request, response, next) {
  cookie.removeAuthenticationCookie(configuration, response);

  oAuth.redirect(configuration, response);
}
```

* The `isAuthenticationCookiePresent()` function takes an `option` argument and a `response` argument.

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

* The `getAccessTokenFromAuthenticationCookie()` function similarly takes an `option` argument and a `response` argument.

## Related links

* [GitHub - JavaScript Secure Application](https://github.com/xomicloud/javascript-secure-application)
* [Developers - JavaScript Lambda Tutorial](https://developers.xomi.cloud/tutorial/javascript-lambda)
* [Knowledge base - The Anatomy of a Secure Application](https://developers.xomi.cloud/knowledge-base/anatomy-of-secure-application)

## Contact

- james.smith@djalbat.com
