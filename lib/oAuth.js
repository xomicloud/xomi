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
    var clientHost = options.clientHost, clientId = options.clientId, redirectURI = options.redirectURI, _clientURI = options.clientURI, clientURI = _clientURI === void 0 ? _constants.DEFAULT_CLIENT_URI : _clientURI, _state = options.state, state = _state === void 0 ? null : _state, _additionalParameters = options.additionalParameters, additionalParameters = _additionalParameters === void 0 ? null : _additionalParameters, scope = _constants.OPEN_ID_SCOPE, client_id = clientId, redirect_uri = redirectURI, response_type = _constants.CODE_RESPONSE_TYPE, parameters = {
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
    var queryString = queryStringFromParameters(parameters), location = "".concat(clientHost).concat(clientURI, "?").concat(queryString);
    _http.default.redirect(response, location);
}
function callback(options, code, callback1) {
    var clientHost = options.clientHost, _clientURI = options.clientURI, clientURI = _clientURI === void 0 ? _constants.DEFAULT_CLIENT_URI : _clientURI, content = createContent(options, code), headers = createHeaders(options, content), host = clientHost, uri = clientURI, parameters = {
    }, readable = _stream.Readable.from(content);
    readable.pipe(post(host, uri, parameters, headers, function(error, remoteResponse) {
        var accessToken = null, refreshToken = null;
        if (error) {
            callback1(error, accessToken, refreshToken);
            return;
        }
        _http.default.bodyFromResponse(remoteResponse, function(body) {
            var json;
            var jsonString = body; ///
            try {
                json = JSON.parse(jsonString);
            } catch (error1) {
                callback1(error1, accessToken, refreshToken);
                return;
            }
            var _access_token = json.access_token, access_token = _access_token === void 0 ? null : _access_token, _refresh_token = json.refresh_token, refresh_token = _refresh_token === void 0 ? null : _refresh_token;
            accessToken = access_token; ///
            refreshToken = refresh_token; ///
            callback1(error, accessToken, refreshToken);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vQXV0aC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IHsgUmVhZGFibGUgfSBmcm9tIFwic3RyZWFtXCI7XG5pbXBvcnQgeyBodHRwVXRpbGl0aWVzLCByZXF1ZXN0VXRpbGl0aWVzIH0gZnJvbSBcIm5lY2Vzc2FyeVwiO1xuXG5pbXBvcnQgaHR0cCBmcm9tIFwiLi9odHRwXCI7XG5cbmltcG9ydCB7IEFQUExJQ0FUSU9OX0pTT05fQ09OVEVOVF9UWVBFLCBBUFBMSUNBVElPTl9YX1dXV19GT1JNX0VOQ09ERURfQ09OVEVOVF9UWVBFIH0gZnJvbSBcIi4vY29udGVudFR5cGVzXCI7XG5pbXBvcnQgeyBCQVNFXzY0LFxuICAgICAgICAgQ09OVEVOVF9UWVBFLFxuICAgICAgICAgT1BFTl9JRF9TQ09QRSxcbiAgICAgICAgIENPTlRFTlRfTEVOR1RILFxuICAgICAgICAgREVGQVVMVF9DTElFTlRfVVJJLFxuICAgICAgICAgQ09ERV9SRVNQT05TRV9UWVBFLFxuICAgICAgICAgQVVUSE9SSVpBVElPTl9DT0RFX0dSQU5UX1RZUEUgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcblxuY29uc3QgeyBwb3N0IH0gPSByZXF1ZXN0VXRpbGl0aWVzLFxuICAgICAgeyBxdWVyeVN0cmluZ0Zyb21QYXJhbWV0ZXJzIH0gPSBodHRwVXRpbGl0aWVzO1xuXG5mdW5jdGlvbiByZWRpcmVjdChvcHRpb25zLCByZXNwb25zZSwgY3JlYXRlQWNjb3VudCA9IGZhbHNlKSB7XG4gIGNvbnN0IHsgY2xpZW50SG9zdCwgY2xpZW50SWQsIHJlZGlyZWN0VVJJLCBjbGllbnRVUkkgPSBERUZBVUxUX0NMSUVOVF9VUkksIHN0YXRlID0gbnVsbCwgYWRkaXRpb25hbFBhcmFtZXRlcnMgPSBudWxsIH0gPSBvcHRpb25zLFxuICAgICAgICBzY29wZSA9IE9QRU5fSURfU0NPUEUsICAvLy9cbiAgICAgICAgY2xpZW50X2lkID0gY2xpZW50SWQsICAvLy9cbiAgICAgICAgcmVkaXJlY3RfdXJpID0gcmVkaXJlY3RVUkksICAvLy9cbiAgICAgICAgcmVzcG9uc2VfdHlwZSA9IENPREVfUkVTUE9OU0VfVFlQRSwgLy8vXG4gICAgICAgIHBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgc2NvcGUsXG4gICAgICAgICAgY2xpZW50X2lkLFxuICAgICAgICAgIHJlZGlyZWN0X3VyaSxcbiAgICAgICAgICByZXNwb25zZV90eXBlXG4gICAgICAgIH07XG5cbiAgaWYgKHN0YXRlKSB7XG4gICAgT2JqZWN0LmFzc2lnbihwYXJhbWV0ZXJzLCB7XG4gICAgICBzdGF0ZVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGNyZWF0ZUFjY291bnQpIHtcbiAgICBjb25zdCBjcmVhdGVfYWNjb3VudCA9IGNyZWF0ZUFjY291bnQ7IC8vL1xuXG4gICAgT2JqZWN0LmFzc2lnbihwYXJhbWV0ZXJzLCB7XG4gICAgICBjcmVhdGVfYWNjb3VudFxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGFkZGl0aW9uYWxQYXJhbWV0ZXJzKSB7XG4gICAgT2JqZWN0LmFzc2lnbihwYXJhbWV0ZXJzLCBhZGRpdGlvbmFsUGFyYW1ldGVycyk7XG4gIH1cblxuICBjb25zdCBxdWVyeVN0cmluZyA9IHF1ZXJ5U3RyaW5nRnJvbVBhcmFtZXRlcnMocGFyYW1ldGVycyksXG4gICAgICAgIGxvY2F0aW9uID0gYCR7Y2xpZW50SG9zdH0ke2NsaWVudFVSSX0/JHtxdWVyeVN0cmluZ31gO1xuXG4gIGh0dHAucmVkaXJlY3QocmVzcG9uc2UsIGxvY2F0aW9uKTtcbn1cblxuZnVuY3Rpb24gY2FsbGJhY2sob3B0aW9ucywgY29kZSwgY2FsbGJhY2spIHtcbiAgY29uc3QgeyBjbGllbnRIb3N0LCBjbGllbnRVUkkgPSBERUZBVUxUX0NMSUVOVF9VUkksIH0gPSBvcHRpb25zLFxuICAgICAgICBjb250ZW50ID0gY3JlYXRlQ29udGVudChvcHRpb25zLCBjb2RlKSxcbiAgICAgICAgaGVhZGVycyA9IGNyZWF0ZUhlYWRlcnMob3B0aW9ucywgY29udGVudCksXG4gICAgICAgIGhvc3QgPSBjbGllbnRIb3N0LCAgLy8vXG4gICAgICAgIHVyaSA9IGNsaWVudFVSSSwgLy8vXG4gICAgICAgIHBhcmFtZXRlcnMgPSB7fSwgIC8vL1xuICAgICAgICByZWFkYWJsZSA9IFJlYWRhYmxlLmZyb20oY29udGVudCk7XG5cbiAgcmVhZGFibGUucGlwZShwb3N0KGhvc3QsIHVyaSwgcGFyYW1ldGVycywgaGVhZGVycywgKGVycm9yLCByZW1vdGVSZXNwb25zZSkgPT4ge1xuICAgIGxldCBhY2Nlc3NUb2tlbiA9IG51bGwsXG4gICAgICAgIHJlZnJlc2hUb2tlbiA9IG51bGw7XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCBhY2Nlc3NUb2tlbiwgcmVmcmVzaFRva2VuKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGh0dHAuYm9keUZyb21SZXNwb25zZShyZW1vdGVSZXNwb25zZSwgKGJvZHkpID0+IHtcbiAgICAgIGxldCBqc29uO1xuXG4gICAgICBjb25zdCBqc29uU3RyaW5nID0gYm9keTsgIC8vL1xuXG4gICAgICB0cnkge1xuICAgICAgICBqc29uID0gSlNPTi5wYXJzZShqc29uU3RyaW5nKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBhY2Nlc3NUb2tlbiwgcmVmcmVzaFRva2VuKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgYWNjZXNzX3Rva2VuID0gbnVsbCwgcmVmcmVzaF90b2tlbiA9IG51bGwgfSA9IGpzb247XG5cbiAgICAgIGFjY2Vzc1Rva2VuID0gYWNjZXNzX3Rva2VuOyAvLy9cbiAgICAgIHJlZnJlc2hUb2tlbiA9IHJlZnJlc2hfdG9rZW47IC8vL1xuXG4gICAgICBjYWxsYmFjayhlcnJvciwgYWNjZXNzVG9rZW4sIHJlZnJlc2hUb2tlbik7XG4gICAgfSk7XG4gIH0pKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICByZWRpcmVjdCxcbiAgY2FsbGJhY2tcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZUhlYWRlcnMob3B0aW9ucywgY29udGVudCkge1xuICBjb25zdCB7IGNsaWVudElkLCBjbGllbnRTZWNyZXQgfSA9IG9wdGlvbnMsXG4gICAgICAgIGRpZ2VzdCA9IGAke2NsaWVudElkfToke2NsaWVudFNlY3JldH1gLFxuICAgICAgICBlbmNvZGVkRGlnZXN0ID0gQnVmZmVyLmZyb20oZGlnZXN0KS50b1N0cmluZyhCQVNFXzY0KSxcbiAgICAgICAgYWNjZXB0ID0gQVBQTElDQVRJT05fSlNPTl9DT05URU5UX1RZUEUsXG4gICAgICAgIGNvbnRlbnRUeXBlID0gQVBQTElDQVRJT05fWF9XV1dfRk9STV9FTkNPREVEX0NPTlRFTlRfVFlQRSxcbiAgICAgICAgY29udGVudExlbmd0aCA9IGNvbnRlbnQubGVuZ3RoLFxuICAgICAgICBhdXRob3JpemF0aW9uID0gYEJhc2ljICR7ZW5jb2RlZERpZ2VzdH1gLFxuICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgIGFjY2VwdCxcbiAgICAgICAgICBhdXRob3JpemF0aW9uXG4gICAgICAgIH07XG5cbiAgaGVhZGVyc1tDT05URU5UX1RZUEVdID0gY29udGVudFR5cGU7XG4gIGhlYWRlcnNbQ09OVEVOVF9MRU5HVEhdID0gY29udGVudExlbmd0aDtcblxuICByZXR1cm4gaGVhZGVycztcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29udGVudChvcHRpb25zLCBjb2RlKSB7XG4gIGNvbnN0IHBhcmFtZXRlcnMgPSBjcmVhdGVQYXJhbWV0ZXJzKG9wdGlvbnMsIGNvZGUpLFxuICAgICAgICBxdWVyeVN0cmluZyA9IHF1ZXJ5U3RyaW5nRnJvbVBhcmFtZXRlcnMocGFyYW1ldGVycyksXG4gICAgICAgIGNvbnRlbnQgPSBxdWVyeVN0cmluZzsgIC8vL1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQYXJhbWV0ZXJzKG9wdGlvbnMsIGNvZGUpIHtcbiAgY29uc3QgeyByZWRpcmVjdFVSSSB9ID0gb3B0aW9ucyxcbiAgICAgICAgZ3JhbnRfdHlwZSA9IEFVVEhPUklaQVRJT05fQ09ERV9HUkFOVF9UWVBFLFxuICAgICAgICByZWRpcmVjdF91cmkgPSByZWRpcmVjdFVSSSwgIC8vL1xuICAgICAgICBwYXJhbWV0ZXJzID0ge1xuICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgZ3JhbnRfdHlwZSxcbiAgICAgICAgICByZWRpcmVjdF91cmlcbiAgICAgICAgfTtcblxuICByZXR1cm4gcGFyYW1ldGVycztcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQ0FBQSxVQUFZOzs7OztJQUVhLE9BQVE7SUFDZSxVQUFXO0lBRTFDLEtBQVE7SUFFa0UsYUFBZ0I7SUFPN0QsVUFBYTs7Ozs7O0lBRW5ELElBQUksR0Fib0MsVUFBVyxrQkFhbkQsSUFBSSxFQUNKLHlCQUF5QixHQWRlLFVBQVcsZUFjbkQseUJBQXlCO1NBRXhCLFFBQVEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQXFCO1FBQXJCLGFBQWEsR0FBYixLQUFxQixjQUFMLEtBQUssR0FBckIsS0FBcUI7UUFDaEQsVUFBVSxHQUF1RyxPQUFPLENBQXhILFVBQVUsRUFBRSxRQUFRLEdBQTZGLE9BQU8sQ0FBNUcsUUFBUSxFQUFFLFdBQVcsR0FBZ0YsT0FBTyxDQUFsRyxXQUFXLGVBQWdGLE9BQU8sQ0FBckYsU0FBUyxFQUFULFNBQVMsMkJBTlIsVUFBYSwyQ0FNZ0UsT0FBTyxDQUFyRCxLQUFLLEVBQUwsS0FBSyx1QkFBRyxJQUFJLG1DQUFrQyxPQUFPLENBQXZDLG9CQUFvQixFQUFwQixvQkFBb0Isc0NBQUcsSUFBSSwwQkFDOUcsS0FBSyxHQVBpQyxVQUFhLGdCQVFuRCxTQUFTLEdBQUcsUUFBUSxFQUNwQixZQUFZLEdBQUcsV0FBVyxFQUMxQixhQUFhLEdBVnlCLFVBQWEscUJBV25ELFVBQVU7UUFDUixLQUFLLEVBQUwsS0FBSztRQUNMLFNBQVMsRUFB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