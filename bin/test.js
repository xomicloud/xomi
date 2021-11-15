"use strict";

const { httpUtilities } = require("necessary");

const { queryStringFromQuery } = httpUtilities;

function test() {
  const funcs = [];

  for (var func in httpUtilities) {
    funcs.push(func);
  }

  return JSON.stringify(funcs);
}

module.exports = test;
