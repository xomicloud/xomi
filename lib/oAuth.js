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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vQXV0aC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IHsgUmVhZGFibGUgfSBmcm9tIFwic3RyZWFtXCI7XG5pbXBvcnQgeyBodHRwVXRpbGl0aWVzLCByZXF1ZXN0VXRpbGl0aWVzIH0gZnJvbSBcIm5lY2Vzc2FyeVwiO1xuXG5pbXBvcnQgaHR0cCBmcm9tIFwiLi9odHRwXCI7XG5cbmltcG9ydCB7IEFQUExJQ0FUSU9OX0pTT05fQ09OVEVOVF9UWVBFLCBBUFBMSUNBVElPTl9YX1dXV19GT1JNX0VOQ09ERURfQ09OVEVOVF9UWVBFIH0gZnJvbSBcIi4vY29udGVudFR5cGVzXCI7XG5pbXBvcnQgeyBST09UX1VSSSwgQkFTRV82NCwgT1BFTl9JRF9TQ09QRSwgQ09OVEVOVF9UWVBFLCBDT05URU5UX0xFTkdUSCwgQ09ERV9SRVNQT05TRV9UWVBFLCBBVVRIT1JJWkFUSU9OX0NPREVfR1JBTlRfVFlQRSB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuXG5jb25zdCB7IHBvc3QgfSA9IHJlcXVlc3RVdGlsaXRpZXMsXG4gICAgICB7IHF1ZXJ5U3RyaW5nRnJvbVBhcmFtZXRlcnMgfSA9IGh0dHBVdGlsaXRpZXM7XG5cbmZ1bmN0aW9uIHJlZGlyZWN0KG9wdGlvbnMsIHJlc3BvbnNlLCBjcmVhdGVBY2NvdW50ID0gZmFsc2UpIHtcbiAgY29uc3QgeyBjbGllbnRIb3N0LCBjbGllbnRJZCwgcmVkaXJlY3RVUkksIHN0YXRlID0gbnVsbCwgYWRkaXRpb25hbFBhcmFtZXRlcnMgPSBudWxsIH0gPSBvcHRpb25zLFxuICAgICAgICBzY29wZSA9IE9QRU5fSURfU0NPUEUsICAvLy9cbiAgICAgICAgY2xpZW50X2lkID0gY2xpZW50SWQsICAvLy9cbiAgICAgICAgcmVkaXJlY3RfdXJpID0gcmVkaXJlY3RVUkksICAvLy9cbiAgICAgICAgcmVzcG9uc2VfdHlwZSA9IENPREVfUkVTUE9OU0VfVFlQRSwgLy8vXG4gICAgICAgIHBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgc2NvcGUsXG4gICAgICAgICAgY2xpZW50X2lkLFxuICAgICAgICAgIHJlZGlyZWN0X3VyaSxcbiAgICAgICAgICByZXNwb25zZV90eXBlXG4gICAgICAgIH07XG5cbiAgaWYgKHN0YXRlKSB7XG4gICAgT2JqZWN0LmFzc2lnbihwYXJhbWV0ZXJzLCB7XG4gICAgICBzdGF0ZVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGNyZWF0ZUFjY291bnQpIHtcbiAgICBjb25zdCBjcmVhdGVfYWNjb3VudCA9IGNyZWF0ZUFjY291bnQ7IC8vL1xuXG4gICAgT2JqZWN0LmFzc2lnbihwYXJhbWV0ZXJzLCB7XG4gICAgICBjcmVhdGVfYWNjb3VudFxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGFkZGl0aW9uYWxQYXJhbWV0ZXJzKSB7XG4gICAgT2JqZWN0LmFzc2lnbihwYXJhbWV0ZXJzLCBhZGRpdGlvbmFsUGFyYW1ldGVycyk7XG4gIH1cblxuXG4gIGNvbnN0IHF1ZXJ5U3RyaW5nID0gcXVlcnlTdHJpbmdGcm9tUGFyYW1ldGVycyhwYXJhbWV0ZXJzKSxcbiAgICAgICAgbG9jYXRpb24gPSBgJHtjbGllbnRIb3N0fT8ke3F1ZXJ5U3RyaW5nfWA7XG5cbiAgaHR0cC5yZWRpcmVjdChyZXNwb25zZSwgbG9jYXRpb24pO1xufVxuXG5mdW5jdGlvbiBjYWxsYmFjayhvcHRpb25zLCBjb2RlLCBjYWxsYmFjaykge1xuICBjb25zdCB7IGNsaWVudEhvc3QgfSA9IG9wdGlvbnMsXG4gICAgICAgIGNvbnRlbnQgPSBjcmVhdGVDb250ZW50KG9wdGlvbnMsIGNvZGUpLFxuICAgICAgICBoZWFkZXJzID0gY3JlYXRlSGVhZGVycyhvcHRpb25zLCBjb250ZW50KSxcbiAgICAgICAgaG9zdCA9IGNsaWVudEhvc3QsICAvLy9cbiAgICAgICAgdXJpID0gUk9PVF9VUkksXG4gICAgICAgIHBhcmFtZXRlcnMgPSB7fSwgIC8vL1xuICAgICAgICByZWFkYWJsZSA9IFJlYWRhYmxlLmZyb20oY29udGVudCk7XG5cbiAgcmVhZGFibGUucGlwZShwb3N0KGhvc3QsIHVyaSwgcGFyYW1ldGVycywgaGVhZGVycywgKGVycm9yLCByZW1vdGVSZXNwb25zZSkgPT4ge1xuICAgIGxldCBhY2Nlc3NUb2tlbiA9IG51bGw7XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCBhY2Nlc3NUb2tlbik7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBodHRwLmJvZHlGcm9tUmVzcG9uc2UocmVtb3RlUmVzcG9uc2UsIChib2R5KSA9PiB7XG4gICAgICBsZXQganNvbjtcblxuICAgICAgY29uc3QganNvblN0cmluZyA9IGJvZHk7ICAvLy9cblxuICAgICAgdHJ5IHtcbiAgICAgICAganNvbiA9IEpTT04ucGFyc2UoanNvblN0cmluZyk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgYWNjZXNzVG9rZW4pO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBhY2Nlc3NfdG9rZW4gPSBudWxsfSA9IGpzb247XG5cbiAgICAgIGFjY2Vzc1Rva2VuID0gYWNjZXNzX3Rva2VuOyAvLy9cblxuICAgICAgY2FsbGJhY2soZXJyb3IsIGFjY2Vzc1Rva2VuKTtcbiAgICB9KTtcbiAgfSkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHJlZGlyZWN0LFxuICBjYWxsYmFja1xufTtcblxuZnVuY3Rpb24gY3JlYXRlSGVhZGVycyhvcHRpb25zLCBjb250ZW50KSB7XG4gIGNvbnN0IHsgY2xpZW50SWQsIGNsaWVudFNlY3JldCB9ID0gb3B0aW9ucyxcbiAgICAgICAgZGlnZXN0ID0gYCR7Y2xpZW50SWR9OiR7Y2xpZW50U2VjcmV0fWAsXG4gICAgICAgIGVuY29kZWREaWdlc3QgPSBCdWZmZXIuZnJvbShkaWdlc3QpLnRvU3RyaW5nKEJBU0VfNjQpLFxuICAgICAgICBhY2NlcHQgPSBBUFBMSUNBVElPTl9KU09OX0NPTlRFTlRfVFlQRSxcbiAgICAgICAgY29udGVudFR5cGUgPSBBUFBMSUNBVElPTl9YX1dXV19GT1JNX0VOQ09ERURfQ09OVEVOVF9UWVBFLFxuICAgICAgICBjb250ZW50TGVuZ3RoID0gY29udGVudC5sZW5ndGgsXG4gICAgICAgIGF1dGhvcml6YXRpb24gPSBgQmFzaWMgJHtlbmNvZGVkRGlnZXN0fWAsXG4gICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgYWNjZXB0LFxuICAgICAgICAgIGF1dGhvcml6YXRpb25cbiAgICAgICAgfTtcblxuICBoZWFkZXJzW0NPTlRFTlRfVFlQRV0gPSBjb250ZW50VHlwZTtcbiAgaGVhZGVyc1tDT05URU5UX0xFTkdUSF0gPSBjb250ZW50TGVuZ3RoO1xuXG4gIHJldHVybiBoZWFkZXJzO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb250ZW50KG9wdGlvbnMsIGNvZGUpIHtcbiAgY29uc3QgcGFyYW1ldGVycyA9IGNyZWF0ZVBhcmFtZXRlcnMob3B0aW9ucywgY29kZSksXG4gICAgICAgIHF1ZXJ5U3RyaW5nID0gcXVlcnlTdHJpbmdGcm9tUGFyYW1ldGVycyhwYXJhbWV0ZXJzKSxcbiAgICAgICAgY29udGVudCA9IHF1ZXJ5U3RyaW5nOyAgLy8vXG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBhcmFtZXRlcnMob3B0aW9ucywgY29kZSkge1xuICBjb25zdCB7IHJlZGlyZWN0VVJJIH0gPSBvcHRpb25zLFxuICAgICAgICBncmFudF90eXBlID0gQVVUSE9SSVpBVElPTl9DT0RFX0dSQU5UX1RZUEUsXG4gICAgICAgIHJlZGlyZWN0X3VyaSA9IHJlZGlyZWN0VVJJLCAgLy8vXG4gICAgICAgIHBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgY29kZSxcbiAgICAgICAgICBncmFudF90eXBlLFxuICAgICAgICAgIHJlZGlyZWN0X3VyaVxuICAgICAgICB9O1xuXG4gIHJldHVybiBwYXJhbWV0ZXJzO1xufVxuIl0sIm5h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