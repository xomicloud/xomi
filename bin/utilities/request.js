"use strict";

const { EMPTY_STRING } = require("../constants");

function uriFromURL(url) {
  const uri = url.replace(/\?.*/, EMPTY_STRING);

  return uri;
}

module.exports = {
  uriFromURL
};
