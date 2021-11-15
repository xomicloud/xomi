"use strict";

const { httpUtilities } = require("necessary");

const { queryStringFromQuery } = httpUtilities;

function test() {
  // const test = "test",
  //       query = {
  //         test
  //       },
  //       queryString = queryStringFromQuery(query);

  return JSON.stringify(httpUtilities);
}

module.exports = test;
