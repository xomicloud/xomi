"use strict";

function pipeline(remoteResponse, response) {
  const { headers, statusCode } = remoteResponse,
        status = statusCode;  ///

  response.status(status);

  for (const name in headers) {
    const value = headers[name];

    response.setHeader(name, value);
  }

  remoteResponse.pipe(response);
}

module.exports = {
  pipeline
};
