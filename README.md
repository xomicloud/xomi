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

## Related links

* [GitHub - JavaScript Secure Application](https://github.com/xomicloud/javascript-secure-application)
* [Developers - JavaScript Lambda Tutorial](https://developers.xomi.cloud/tutorial/javascript-lambda)
* [Knowledge base - The Anatomy of a Secure Application](https://developers.xomi.cloud/knowledge-base/anatomy-of-secure-application)

## Contact

- james.smith@djalbat.com
