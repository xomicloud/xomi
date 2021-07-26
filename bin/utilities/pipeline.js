"use strict";

function pipeline(_response, response) {
  const { headers, statusCode } = _response,
        status = statusCode;  ///

  response.status(status);

  for (const name in headers) {
    const value = headers[name];

    response.setHeader(name, value);
  }

  _response.pipe(response);
}

module.exports = {
  pipeline
};
