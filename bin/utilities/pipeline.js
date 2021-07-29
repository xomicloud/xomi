"use strict";

const { TRANSFER_ENCODING } = require("../constants");

function pipeline(_response, response) {
  const { headers, statusCode } = _response,
        status = statusCode;  ///

  response.status(status);

  for (const name in headers) {
    const lowerCaseName = name.toLowerCase(),
          lowerCaseTransferEncoding = TRANSFER_ENCODING.toLowerCase();

    if (lowerCaseName !== lowerCaseTransferEncoding) {
      const value = headers[name];

      response.setHeader(name, value);
    }
  }

  _response.pipe(response);
}

module.exports = {
  pipeline
};
