# Xomi

Secure functionality for Xomi. This is divided up as follows:

- [OAuth (oAuth)](#oauth)
- [Cookies (cookie)](#cookies)
- [Integrations (api)](#integrations)
- [Authentication (authenticate)](#authentication)
- [Account information (account)](#account_information)

This readme file contains installation instructions and usage examples. The tutorials and knowledge base articles referenced throughout may provide a friendlier introduction, however, and they are collected in the related links section near the end.

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

const { CLIENT_HOST, CLIENT_ID, REDIRECT_URI, CLIENT_SECRET } = process.env,
      clientId = CLIENT_ID, ///
      clientHost = CLIENT_HOST, ///
      redirectURI = REDIRECT_URI, ///
      clientSecret = CLIENT_SECRET, ///
      configuration = {
        clientId,
        clientHost,
        redirectURI,
        clientSecret
      }; 

module.exports = configuration;
```
You invoke the functions as follows:

```
const { oAuth, cookie, account } = require("@xomicloud/xomi");

const configuration = require("../configuration");

account(configuration, ...) // Retrieve account ifformation

oAuth.callback(configuration, ...); //  Make an OAuth callback

cookie.setAuthenticationCookie(configuration, ...)  //  Set an authentication cookie
```

Some package exports, such as `aacount`, are single functions. Others, such as `oAuth`, are collections of functions.  Note the use of the aforementioned `configuration` argument which is assumed to be defined as above.

### OAuth

- `redirect()`
- `callback()`

These functions will redirect the browser to the Xomi authentication site and handle the subsequent callback, respectively. Usage examples can be found in the [JavaScript secure application](https://github.com/xomicloud/javascript-secure-application) repository and further information can be found in [The Anatomy of a Secure Application](https://developers.xomi.cloud/knowledge-base/anatomy-of-secure-application) knowledge base article.

* The `redirect()` function takes `configuration` and `response` arguments. The response is expected to be an instance of Node's [ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse) class. You can also pass a third, optional `createAccount` argument that, if set to true, instructs the authentication site to show the form to create an account rather than the sign up form.

```
const { oAuth } = require("@xomicloud/xomi");

const configuration = require("../configuration");

function signInHandler(request, response, next) {
  const createAccount = false;

  oAuth.redirect(configuration, response, createAccount);
}
```

* The `callback()` function takes `configuration`, `code` and `callback` function arguments. The `code` argument is the code returned by the authentication site when the user successfully authenticates and can be recovered from the request object, assuming it is an instance of Node's [IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) class. The callback function should accept an `error` argument together witih `accessToken`, `refreshToken` and `identityToken` arguments.

```
const { oAuth, cookie } = require("@xomicloud/xomi");

const configuration = require("../configuration");

function callbackHandler(request, response, next) {
  const { query } = request,
        { code } = query;

  oAuth.callback(configuration, code, (error, accessToken, refreshToken, identityToken) => {
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

These functions supply basic authentication cookie functionality. Usage examples can again be found in the JavaScript secure application repository and further information in The Anatomy of a Secure Application knowledge base article.

* The `setAuthenticationCookie()` function takes `configuration`, `response`, `accessToken` and `identityToken` arguments. It also takes an optional `rememberMe` argument which, if set to true, sets the expiry of the cookie well into the future. The response is expected to be an instance of Node's ServerResponse class.

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

* The `getAccessTokenFromAuthenticationCookie()` function takes `configuration` and `response` arguments. It returns an access token if the authentication cookie exists and can be parsed, `null` otherwise.

* The `getIdentityTokenFromAuthenticationCookie()` function similarly takes `configuration` and `response` arguments. It returns an identity token if the authentication cookie exists and can be parsed, `null` otherwise.

### Integrations

- `api()`

There is only one function that connects to Xomi's API server. Only an outline of its usage is given here. More detailed information can be found in the [Dropbox integration tutorial](https://developers.xomi.cloud/tutorial/dropbox-integration).

* The `api` function takes `configuration`, `request` and `response` arguments:
 
```
const { api } = require("@xomicloud/xomi");

api(configuration, request, response);
```

In this instance the `request` and `response` objects do not have to be instances of Node's IncomingMessage and ServerResponse classes and can be hand rolled. Again, see the tutorial for more details.

### Authentication

- `signIn()`
- `createAccount()`
- `resetPassword()`

There are three functions relating to managing accounts. Together they provide an alternative to the usual browser based OAuth flow for authentication.

* The `signIn` function takes `configuration`, `emailAddressOrUsername`, `password` and `callback` arguments:

```
signIn(configuration, emailAddressOrUsername, password, (error, accessToken, identityToken) => {
  if (error) {
    ///
    
    return;
  }
  
  ///
}));
```

The function will invoke the callback function you provide with an error code and, if successful, an access token and an identity token.

* The `createAccount` function takes `configuration`, `emailAddress`, `username`, `password` and `callback` arguments. The `username` argument can be `null` if usernames are not needed: 

```
createAccount(configuration, emailAddress, username, password, (error, accessToken, identityToken) => {
  if (error) {
    ///
    
    return;
  }
  
  ///
}));
```

The function will invoke the callback function you provide with an error code and, if successful, an access token and an identity token.

* The `restePassword` function takes `configuration`, `emailAddress` and `callback` arguments:

```
resetPassword(configuration, emailAddress, (error) => {
  if (error) {
    ///
    
    return;
  }
  
  ///
}));
```

If the email address corresponds to an user'a account then an email will be sent. The function additionally will invoke the callback function you provide with an error code but does not indicate whether or not an email was send for security reasons.

### Account information

- `account()`

Again there is only one function. It provides a user's details in return for their identity token.

* The `account` function takes `configuration`, `identityToken` and `callback` arguments:

```
const { account } = require("@xomicloud/xomi");

account(configuration, identityToken, (error, account) => {
  if (error) {
    ///
    
    return;
  }
  
  const { usernmae, email_address } = account;
  
  ///
}));
```

The function will invoke the callback function you provide with an error code and, provided you are authorized to retrieve that user's details, a plain old JavaScript object with the user's account details. Presently this is their email address and username.

## Related links

* [GitHub - JavaScript Integrations](https://github.com/xomicloud/javascript-integrations)
* [GitHub - JavaScript Secure Application](https://github.com/xomicloud/javascript-secure-application)
* [Developers - JavaScript Lambda Tutorial](https://developers.xomi.cloud/tutorial/javascript-lambda)
* [Developers - Dropbox Integration Tutorial](https://developers.xomi.cloud/tutorial/dropbox-integration)
* [Developers - JavaScript localhost Tutorial](https://developers.xomi.cloud/tutorial/javascript-localhost)
* [Knowledge base - The Anatomy of a Secure Application](https://developers.xomi.cloud/knowledge-base/anatomy-of-secure-application)

## Contact

- james.smith@djalbat.com
