"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _stream = require("stream");
var _necessary = require("necessary");
var _http = _interopRequireDefault(require("./http"));
var _contentTypes = require("./contentTypes");
var _constants = require("./constants");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var post = _necessary.requestUtilities.post, queryStringFromParameters = _necessary.httpUtilities.queryStringFromParameters;
function redirect(options, response, param) {
    var createAccount = param === void 0 ? false : param;
    var clientHost = options.clientHost, clientId = options.clientId, redirectURI = options.redirectURI, _state = options.state, state = _state === void 0 ? null : _state, _additionalParameters = options.additionalParameters, additionalParameters = _additionalParameters === void 0 ? null : _additionalParameters, scope = _constants.OPEN_ID_SCOPE, client_id = clientId, redirect_uri = redirectURI, response_type = _constants.CODE_RESPONSE_TYPE, parameters = {
        scope: scope,
        client_id: client_id,
        redirect_uri: redirect_uri,
        response_type: response_type
    };
    if (state) {
        Object.assign(parameters, {
            state: state
        });
    }
    if (createAccount) {
        var create_account = createAccount; ///
        Object.assign(parameters, {
            create_account: create_account
        });
    }
    if (additionalParameters) {
        Object.assign(parameters, additionalParameters);
    }
    var queryString = queryStringFromParameters(parameters), location = "".concat(clientHost, "?").concat(queryString);
    _http.default.redirect(response, location);
}
function callback(options, code, callback1) {
    var clientHost = options.clientHost, content = createContent(options, code), headers = createHeaders(options, content), host = clientHost, uri = _constants.ROOT_URI, parameters = {
    }, readable = _stream.Readable.from(content);
    readable.pipe(post(host, uri, parameters, headers, function(error, remoteResponse) {
        var accessToken = null;
        if (error) {
            callback1(error, accessToken);
            return;
        }
        _http.default.bodyFromResponse(remoteResponse, function(body) {
            var json;
            var jsonString = body; ///
            try {
                json = JSON.parse(jsonString);
            } catch (error1) {
                callback1(error1, accessToken);
                return;
            }
            var _access_token = json.access_token, access_token = _access_token === void 0 ? null : _access_token;
            accessToken = access_token; ///
            callback1(error, accessToken);
        });
    }));
}
var _default = {
    redirect: redirect,
    callback: callback
};
exports.default = _default;
function createHeaders(options, content) {
    var clientId = options.clientId, clientSecret = options.clientSecret, digest = "".concat(clientId, ":").concat(clientSecret), encodedDigest = Buffer.from(digest).toString(_constants.BASE_64), accept = _contentTypes.APPLICATION_JSON_CONTENT_TYPE, contentType = _contentTypes.APPLICATION_X_WWW_FORM_ENCODED_CONTENT_TYPE, contentLength = content.length, authorization = "Basic ".concat(encodedDigest), headers = {
        accept: accept,
        authorization: authorization
    };
    headers[_constants.CONTENT_TYPE] = contentType;
    headers[_constants.CONTENT_LENGTH] = contentLength;
    return headers;
}
function createContent(options, code) {
    var parameters = createParameters(options, code), queryString = queryStringFromParameters(parameters), content = queryString; ///
    return content;
}
function createParameters(options, code) {
    var redirectURI = options.redirectURI, grant_type = _constants.AUTHORIZATION_CODE_GRANT_TYPE, redirect_uri = redirectURI, parameters = {
        code: code,
        grant_type: grant_type,
        redirect_uri: redirect_uri
    };
    return parameters;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vQXV0aC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IHsgUmVhZGFibGUgfSBmcm9tIFwic3RyZWFtXCI7XG5pbXBvcnQgeyBodHRwVXRpbGl0aWVzLCByZXF1ZXN0VXRpbGl0aWVzIH0gZnJvbSBcIm5lY2Vzc2FyeVwiO1xuXG5pbXBvcnQgaHR0cCBmcm9tIFwiLi9odHRwXCI7XG5cbmltcG9ydCB7IEFQUExJQ0FUSU9OX0pTT05fQ09OVEVOVF9UWVBFLCBBUFBMSUNBVElPTl9YX1dXV19GT1JNX0VOQ09ERURfQ09OVEVOVF9UWVBFIH0gZnJvbSBcIi4vY29udGVudFR5cGVzXCI7XG5pbXBvcnQgeyBST09UX1VSSSwgQkFTRV82NCwgT1BFTl9JRF9TQ09QRSwgQ09OVEVOVF9UWVBFLCBDT05URU5UX0xFTkdUSCwgQ09ERV9SRVNQT05TRV9UWVBFLCBBVVRIT1JJWkFUSU9OX0NPREVfR1JBTlRfVFlQRSB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuXG5jb25zdCB7IHBvc3QgfSA9IHJlcXVlc3RVdGlsaXRpZXMsXG4gICAgICB7IHF1ZXJ5U3RyaW5nRnJvbVBhcmFtZXRlcnMgfSA9IGh0dHBVdGlsaXRpZXM7XG5cbmZ1bmN0aW9uIHJlZGlyZWN0KG9wdGlvbnMsIHJlc3BvbnNlLCBjcmVhdGVBY2NvdW50ID0gZmFsc2UpIHtcbiAgY29uc3QgeyBjbGllbnRIb3N0LCBjbGllbnRJZCwgcmVkaXJlY3RVUkksIHN0YXRlID0gbnVsbCwgYWRkaXRpb25hbFBhcmFtZXRlcnMgPSBudWxsIH0gPSBvcHRpb25zLFxuICAgICAgICBzY29wZSA9IE9QRU5fSURfU0NPUEUsICAvLy9cbiAgICAgICAgY2xpZW50X2lkID0gY2xpZW50SWQsICAvLy9cbiAgICAgICAgcmVkaXJlY3RfdXJpID0gcmVkaXJlY3RVUkksICAvLy9cbiAgICAgICAgcmVzcG9uc2VfdHlwZSA9IENPREVfUkVTUE9OU0VfVFlQRSwgLy8vXG4gICAgICAgIHBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgc2NvcGUsXG4gICAgICAgICAgY2xpZW50X2lkLFxuICAgICAgICAgIHJlZGlyZWN0X3VyaSxcbiAgICAgICAgICByZXNwb25zZV90eXBlXG4gICAgICAgIH07XG5cbiAgaWYgKHN0YXRlKSB7XG4gICAgT2JqZWN0LmFzc2lnbihwYXJhbWV0ZXJzLCB7XG4gICAgICBzdGF0ZVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGNyZWF0ZUFjY291bnQpIHtcbiAgICBjb25zdCBjcmVhdGVfYWNjb3VudCA9IGNyZWF0ZUFjY291bnQ7IC8vL1xuXG4gICAgT2JqZWN0LmFzc2lnbihwYXJhbWV0ZXJzLCB7XG4gICAgICBjcmVhdGVfYWNjb3VudFxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGFkZGl0aW9uYWxQYXJhbWV0ZXJzKSB7XG4gICAgT2JqZWN0LmFzc2lnbihwYXJhbWV0ZXJzLCBhZGRpdGlvbmFsUGFyYW1ldGVycyk7XG4gIH1cblxuICBjb25zdCBxdWVyeVN0cmluZyA9IHF1ZXJ5U3RyaW5nRnJvbVBhcmFtZXRlcnMocGFyYW1ldGVycyksXG4gICAgICAgIGxvY2F0aW9uID0gYCR7Y2xpZW50SG9zdH0/JHtxdWVyeVN0cmluZ31gO1xuXG4gIGh0dHAucmVkaXJlY3QocmVzcG9uc2UsIGxvY2F0aW9uKTtcbn1cblxuZnVuY3Rpb24gY2FsbGJhY2sob3B0aW9ucywgY29kZSwgY2FsbGJhY2spIHtcbiAgY29uc3QgeyBjbGllbnRIb3N0IH0gPSBvcHRpb25zLFxuICAgICAgICBjb250ZW50ID0gY3JlYXRlQ29udGVudChvcHRpb25zLCBjb2RlKSxcbiAgICAgICAgaGVhZGVycyA9IGNyZWF0ZUhlYWRlcnMob3B0aW9ucywgY29udGVudCksXG4gICAgICAgIGhvc3QgPSBjbGllbnRIb3N0LCAgLy8vXG4gICAgICAgIHVyaSA9IFJPT1RfVVJJLFxuICAgICAgICBwYXJhbWV0ZXJzID0ge30sICAvLy9cbiAgICAgICAgcmVhZGFibGUgPSBSZWFkYWJsZS5mcm9tKGNvbnRlbnQpO1xuXG4gIHJlYWRhYmxlLnBpcGUocG9zdChob3N0LCB1cmksIHBhcmFtZXRlcnMsIGhlYWRlcnMsIChlcnJvciwgcmVtb3RlUmVzcG9uc2UpID0+IHtcbiAgICBsZXQgYWNjZXNzVG9rZW4gPSBudWxsO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBjYWxsYmFjayhlcnJvciwgYWNjZXNzVG9rZW4pO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaHR0cC5ib2R5RnJvbVJlc3BvbnNlKHJlbW90ZVJlc3BvbnNlLCAoYm9keSkgPT4ge1xuICAgICAgbGV0IGpzb247XG5cbiAgICAgIGNvbnN0IGpzb25TdHJpbmcgPSBib2R5OyAgLy8vXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGpzb24gPSBKU09OLnBhcnNlKGpzb25TdHJpbmcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIGFjY2Vzc1Rva2VuKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgYWNjZXNzX3Rva2VuID0gbnVsbH0gPSBqc29uO1xuXG4gICAgICBhY2Nlc3NUb2tlbiA9IGFjY2Vzc190b2tlbjsgLy8vXG5cbiAgICAgIGNhbGxiYWNrKGVycm9yLCBhY2Nlc3NUb2tlbik7XG4gICAgfSk7XG4gIH0pKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICByZWRpcmVjdCxcbiAgY2FsbGJhY2tcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZUhlYWRlcnMob3B0aW9ucywgY29udGVudCkge1xuICBjb25zdCB7IGNsaWVudElkLCBjbGllbnRTZWNyZXQgfSA9IG9wdGlvbnMsXG4gICAgICAgIGRpZ2VzdCA9IGAke2NsaWVudElkfToke2NsaWVudFNlY3JldH1gLFxuICAgICAgICBlbmNvZGVkRGlnZXN0ID0gQnVmZmVyLmZyb20oZGlnZXN0KS50b1N0cmluZyhCQVNFXzY0KSxcbiAgICAgICAgYWNjZXB0ID0gQVBQTElDQVRJT05fSlNPTl9DT05URU5UX1RZUEUsXG4gICAgICAgIGNvbnRlbnRUeXBlID0gQVBQTElDQVRJT05fWF9XV1dfRk9STV9FTkNPREVEX0NPTlRFTlRfVFlQRSxcbiAgICAgICAgY29udGVudExlbmd0aCA9IGNvbnRlbnQubGVuZ3RoLFxuICAgICAgICBhdXRob3JpemF0aW9uID0gYEJhc2ljICR7ZW5jb2RlZERpZ2VzdH1gLFxuICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgIGFjY2VwdCxcbiAgICAgICAgICBhdXRob3JpemF0aW9uXG4gICAgICAgIH07XG5cbiAgaGVhZGVyc1tDT05URU5UX1RZUEVdID0gY29udGVudFR5cGU7XG4gIGhlYWRlcnNbQ09OVEVOVF9MRU5HVEhdID0gY29udGVudExlbmd0aDtcblxuICByZXR1cm4gaGVhZGVycztcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29udGVudChvcHRpb25zLCBjb2RlKSB7XG4gIGNvbnN0IHBhcmFtZXRlcnMgPSBjcmVhdGVQYXJhbWV0ZXJzKG9wdGlvbnMsIGNvZGUpLFxuICAgICAgICBxdWVyeVN0cmluZyA9IHF1ZXJ5U3RyaW5nRnJvbVBhcmFtZXRlcnMocGFyYW1ldGVycyksXG4gICAgICAgIGNvbnRlbnQgPSBxdWVyeVN0cmluZzsgIC8vL1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQYXJhbWV0ZXJzKG9wdGlvbnMsIGNvZGUpIHtcbiAgY29uc3QgeyByZWRpcmVjdFVSSSB9ID0gb3B0aW9ucyxcbiAgICAgICAgZ3JhbnRfdHlwZSA9IEFVVEhPUklaQVRJT05fQ09ERV9HUkFOVF9UWVBFLFxuICAgICAgICByZWRpcmVjdF91cmkgPSByZWRpcmVjdFVSSSwgIC8vL1xuICAgICAgICBwYXJhbWV0ZXJzID0ge1xuICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgZ3JhbnRfdHlwZSxcbiAgICAgICAgICByZWRpcmVjdF91cmlcbiAgICAgICAgfTtcblxuICByZXR1cm4gcGFyYW1ldGVycztcbn1cbiJdLCJuYW1l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