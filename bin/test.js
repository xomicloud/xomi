"use strict";

const { httpUtilities } = require("necessary");

const { queryStringFromQuery } = httpUtilities;

function test() {
  const test = "test",
        query = {
          test
        },
        queryString = queryStringFromQuery(query);

  return queryString
}

module.exports = test;
