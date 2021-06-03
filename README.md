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

## Building

Automation is done with [npm scripts](https://docs.npmjs.com/misc/scripts), have a look at the `package.json` file. The pertinent commands are:

    npm run build-debug
    npm run watch-debug

As with cloning, there is no need to do this unless you are interested in Xomi's development.

## Contact

- james.smith@djalbat.com
