# Xomi

OAuth and cookie functionality for Xomi.

## Installation

You can install Xomi with [npm](https://www.npmjs.com/):

    npm install @xomicloud/xomi

You can also clone the repository with [Git](https://git-scm.com/)...

    git clone https://github.com/xomicloud/xomi.git

...and then install the dependencies with npm from within the project's root directory:

    npm install

You only need to do this if you are interested in Xomi's development, however.

## Usage

All of the functions take a plain old JavaScript object as their first `options` argument, the properties of which must be the client configuration. If you are using the standard set of environment variables then the following code snippet will return the required object:

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

const options = require("options");

oAuth.callback(options, ...); //  Make an OAuth callback

cookie.setAuthenticationCookie(options, ...)  //  Set an authentication cookie
```

Note the use of the aforementioned `options` argument.

### OAuth functionality

These functions will redirect the browser to the Xomi authentication site and handle the subsequent callback.

- `redirect()`
- `callback()`

* The `redirect()` function takes an `option` argument and a `response` argument. The latter is expected to be an instance of Node's [ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse). You can also pass a third, optional `createAccount` argument that, if set to true, instructs the authentication site to show the form to create an account rather than the sign up form.

```
const { oAuth } = require("@xomicloud/xomi");

const options = require("../options");

function signInHandler(request, response, next) {
  const createAccount = false;

  oAuth.redirect(options, response, createAccount);
}
```

* The `callback()` function takes an `option` argument, a `code` argument and a `callback` function argument. The `code` argument is expected to be the code returned by the authentication site when the user successfully authenticates and can be recovered from the request object, assuming it is an instance of Node's [IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) class. The callback function should accept an `error` and an `accessToken` argument.

```
const { oAuth, cookie } = require("@xomicloud/xomi");

const paths = require("../paths"),
      options = require("../options");

function callbackHandler(request, response, next) {
  const { query } = request,
        { code } = query;

  oAuth.callback(options, code, (error, accessToken) => {
    ///
  });
}

module.exports = callbackHandler;
```

## Related links

* [GitHub - JavaScript Secure Application](https://github.com/xomicloud/javascript-secure-application)
* [Developers - JavaScript Lambda Tutorial](https://developers.xomi.cloud/tutorial/javascript-lambda)
* [Knowledge base - The Anatomy of a Secure Application](https://developers.xomi.cloud/knowledge-base/anatomy-of-secure-application)

## Contact

- james.smith@djalbat.com
