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
    var clientHost = options.clientHost, content = createContent(options, code), headers = createHeaders(options, content), host = clientHost, uri = _constants.EMPTY_STRING, parameters = {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vQXV0aC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IHsgUmVhZGFibGUgfSBmcm9tIFwic3RyZWFtXCI7XG5pbXBvcnQgeyBodHRwVXRpbGl0aWVzLCByZXF1ZXN0VXRpbGl0aWVzIH0gZnJvbSBcIm5lY2Vzc2FyeVwiO1xuXG5pbXBvcnQgaHR0cCBmcm9tIFwiLi9odHRwXCI7XG5cbmltcG9ydCB7IEFQUExJQ0FUSU9OX0pTT05fQ09OVEVOVF9UWVBFLCBBUFBMSUNBVElPTl9YX1dXV19GT1JNX0VOQ09ERURfQ09OVEVOVF9UWVBFIH0gZnJvbSBcIi4vY29udGVudFR5cGVzXCI7XG5pbXBvcnQgeyBCQVNFXzY0LFxuICAgICAgICAgRU1QVFlfU1RSSU5HLFxuICAgICAgICAgQ09OVEVOVF9UWVBFLFxuICAgICAgICAgT1BFTl9JRF9TQ09QRSxcbiAgICAgICAgIENPTlRFTlRfTEVOR1RILFxuICAgICAgICAgQ09ERV9SRVNQT05TRV9UWVBFLFxuICAgICAgICAgQVVUSE9SSVpBVElPTl9DT0RFX0dSQU5UX1RZUEUgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcblxuY29uc3QgeyBwb3N0IH0gPSByZXF1ZXN0VXRpbGl0aWVzLFxuICAgICAgeyBxdWVyeVN0cmluZ0Zyb21QYXJhbWV0ZXJzIH0gPSBodHRwVXRpbGl0aWVzO1xuXG5mdW5jdGlvbiByZWRpcmVjdChvcHRpb25zLCByZXNwb25zZSwgY3JlYXRlQWNjb3VudCA9IGZhbHNlKSB7XG4gIGNvbnN0IHsgY2xpZW50SG9zdCwgY2xpZW50SWQsIHJlZGlyZWN0VVJJLCBzdGF0ZSA9IG51bGwsIGFkZGl0aW9uYWxQYXJhbWV0ZXJzID0gbnVsbCB9ID0gb3B0aW9ucyxcbiAgICAgICAgc2NvcGUgPSBPUEVOX0lEX1NDT1BFLCAgLy8vXG4gICAgICAgIGNsaWVudF9pZCA9IGNsaWVudElkLCAgLy8vXG4gICAgICAgIHJlZGlyZWN0X3VyaSA9IHJlZGlyZWN0VVJJLCAgLy8vXG4gICAgICAgIHJlc3BvbnNlX3R5cGUgPSBDT0RFX1JFU1BPTlNFX1RZUEUsIC8vL1xuICAgICAgICBwYXJhbWV0ZXJzID0ge1xuICAgICAgICAgIHNjb3BlLFxuICAgICAgICAgIGNsaWVudF9pZCxcbiAgICAgICAgICByZWRpcmVjdF91cmksXG4gICAgICAgICAgcmVzcG9uc2VfdHlwZVxuICAgICAgICB9O1xuXG4gIGlmIChzdGF0ZSkge1xuICAgIE9iamVjdC5hc3NpZ24ocGFyYW1ldGVycywge1xuICAgICAgc3RhdGVcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChjcmVhdGVBY2NvdW50KSB7XG4gICAgY29uc3QgY3JlYXRlX2FjY291bnQgPSBjcmVhdGVBY2NvdW50OyAvLy9cblxuICAgIE9iamVjdC5hc3NpZ24ocGFyYW1ldGVycywge1xuICAgICAgY3JlYXRlX2FjY291bnRcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChhZGRpdGlvbmFsUGFyYW1ldGVycykge1xuICAgIE9iamVjdC5hc3NpZ24ocGFyYW1ldGVycywgYWRkaXRpb25hbFBhcmFtZXRlcnMpO1xuICB9XG5cbiAgY29uc3QgcXVlcnlTdHJpbmcgPSBxdWVyeVN0cmluZ0Zyb21QYXJhbWV0ZXJzKHBhcmFtZXRlcnMpLFxuICAgICAgICBsb2NhdGlvbiA9IGAke2NsaWVudEhvc3R9PyR7cXVlcnlTdHJpbmd9YDtcblxuICBodHRwLnJlZGlyZWN0KHJlc3BvbnNlLCBsb2NhdGlvbik7XG59XG5cbmZ1bmN0aW9uIGNhbGxiYWNrKG9wdGlvbnMsIGNvZGUsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IHsgY2xpZW50SG9zdCB9ID0gb3B0aW9ucyxcbiAgICAgICAgY29udGVudCA9IGNyZWF0ZUNvbnRlbnQob3B0aW9ucywgY29kZSksXG4gICAgICAgIGhlYWRlcnMgPSBjcmVhdGVIZWFkZXJzKG9wdGlvbnMsIGNvbnRlbnQpLFxuICAgICAgICBob3N0ID0gY2xpZW50SG9zdCwgIC8vL1xuICAgICAgICB1cmkgPSBFTVBUWV9TVFJJTkcsIC8vL1xuICAgICAgICBwYXJhbWV0ZXJzID0ge30sICAvLy9cbiAgICAgICAgcmVhZGFibGUgPSBSZWFkYWJsZS5mcm9tKGNvbnRlbnQpO1xuXG4gIHJlYWRhYmxlLnBpcGUocG9zdChob3N0LCB1cmksIHBhcmFtZXRlcnMsIGhlYWRlcnMsIChlcnJvciwgcmVtb3RlUmVzcG9uc2UpID0+IHtcbiAgICBsZXQgYWNjZXNzVG9rZW4gPSBudWxsLFxuICAgICAgICByZWZyZXNoVG9rZW4gPSBudWxsO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBjYWxsYmFjayhlcnJvciwgYWNjZXNzVG9rZW4sIHJlZnJlc2hUb2tlbik7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBodHRwLmJvZHlGcm9tUmVzcG9uc2UocmVtb3RlUmVzcG9uc2UsIChib2R5KSA9PiB7XG4gICAgICBsZXQganNvbjtcblxuICAgICAgY29uc3QganNvblN0cmluZyA9IGJvZHk7ICAvLy9cblxuICAgICAgdHJ5IHtcbiAgICAgICAganNvbiA9IEpTT04ucGFyc2UoanNvblN0cmluZyk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgYWNjZXNzVG9rZW4sIHJlZnJlc2hUb2tlbik7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGFjY2Vzc190b2tlbiA9IG51bGwsIHJlZnJlc2hfdG9rZW4gPSBudWxsIH0gPSBqc29uO1xuXG4gICAgICBhY2Nlc3NUb2tlbiA9IGFjY2Vzc190b2tlbjsgLy8vXG4gICAgICByZWZyZXNoVG9rZW4gPSByZWZyZXNoX3Rva2VuOyAvLy9cblxuICAgICAgY2FsbGJhY2soZXJyb3IsIGFjY2Vzc1Rva2VuLCByZWZyZXNoVG9rZW4pO1xuICAgIH0pO1xuICB9KSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcmVkaXJlY3QsXG4gIGNhbGxiYWNrXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVIZWFkZXJzKG9wdGlvbnMsIGNvbnRlbnQpIHtcbiAgY29uc3QgeyBjbGllbnRJZCwgY2xpZW50U2VjcmV0IH0gPSBvcHRpb25zLFxuICAgICAgICBkaWdlc3QgPSBgJHtjbGllbnRJZH06JHtjbGllbnRTZWNyZXR9YCxcbiAgICAgICAgZW5jb2RlZERpZ2VzdCA9IEJ1ZmZlci5mcm9tKGRpZ2VzdCkudG9TdHJpbmcoQkFTRV82NCksXG4gICAgICAgIGFjY2VwdCA9IEFQUExJQ0FUSU9OX0pTT05fQ09OVEVOVF9UWVBFLFxuICAgICAgICBjb250ZW50VHlwZSA9IEFQUExJQ0FUSU9OX1hfV1dXX0ZPUk1fRU5DT0RFRF9DT05URU5UX1RZUEUsXG4gICAgICAgIGNvbnRlbnRMZW5ndGggPSBjb250ZW50Lmxlbmd0aCxcbiAgICAgICAgYXV0aG9yaXphdGlvbiA9IGBCYXNpYyAke2VuY29kZWREaWdlc3R9YCxcbiAgICAgICAgaGVhZGVycyA9IHtcbiAgICAgICAgICBhY2NlcHQsXG4gICAgICAgICAgYXV0aG9yaXphdGlvblxuICAgICAgICB9O1xuXG4gIGhlYWRlcnNbQ09OVEVOVF9UWVBFXSA9IGNvbnRlbnRUeXBlO1xuICBoZWFkZXJzW0NPTlRFTlRfTEVOR1RIXSA9IGNvbnRlbnRMZW5ndGg7XG5cbiAgcmV0dXJuIGhlYWRlcnM7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRlbnQob3B0aW9ucywgY29kZSkge1xuICBjb25zdCBwYXJhbWV0ZXJzID0gY3JlYXRlUGFyYW1ldGVycyhvcHRpb25zLCBjb2RlKSxcbiAgICAgICAgcXVlcnlTdHJpbmcgPSBxdWVyeVN0cmluZ0Zyb21QYXJhbWV0ZXJzKHBhcmFtZXRlcnMpLFxuICAgICAgICBjb250ZW50ID0gcXVlcnlTdHJpbmc7ICAvLy9cblxuICByZXR1cm4gY29udGVudDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUGFyYW1ldGVycyhvcHRpb25zLCBjb2RlKSB7XG4gIGNvbnN0IHsgcmVkaXJlY3RVUkkgfSA9IG9wdGlvbnMsXG4gICAgICAgIGdyYW50X3R5cGUgPSBBVVRIT1JJWkFUSU9OX0NPREVfR1JBTlRfVFlQRSxcbiAgICAgICAgcmVkaXJlY3RfdXJpID0gcmVkaXJlY3RVUkksICAvLy9cbiAgICAgICAgcGFyYW1ldGVycyA9IHtcbiAgICAgICAgICBjb2RlLFxuICAgICAgICAgIGdyYW50X3R5cGUsXG4gICAgICAgICAgcmVkaXJlY3RfdXJpXG4gICAgICAgIH07XG5cbiAgcmV0dXJuIHBhcmFtZXRlcnM7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkNBQUEsVUFBWTs7Ozs7SUFFYSxPQUFRO0lBQ2UsVUFBVztJQUUxQyxLQUFRO0lBRWtFLGFBQWdCO0lBTzdELFVBQWE7Ozs7OztJQUVuRCxJQUFJLEdBYm9DLFVBQVcsa0JBYW5ELElBQUksRUFDSix5QkFBeUIsR0FkZSxVQUFXLGVBY25ELHlCQUF5QjtTQUV4QixRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFxQjtRQUFyQixhQUFhLEdBQWIsS0FBcUIsY0FBTCxLQUFLLEdBQXJCLEtBQXFCO1FBQ2hELFVBQVUsR0FBdUUsT0FBTyxDQUF4RixVQUFVLEVBQUUsUUFBUSxHQUE2RCxPQUFPLENBQTVFLFFBQVEsRUFBRSxXQUFXLEdBQWdELE9BQU8sQ0FBbEUsV0FBVyxXQUFnRCxPQUFPLENBQXJELEtBQUssRUFBTCxLQUFLLHVCQUFHLElBQUksbUNBQWtDLE9BQU8sQ0FBdkMsb0JBQW9CLEVBQXBCLG9CQUFvQixzQ0FBRyxJQUFJLDBCQUM5RSxLQUFLLEdBUGlDLFVBQWEsZ0JBUW5ELFNBQVMsR0FBRyxRQUFRLEVBQ3BCLFlBQVksR0FBRyxXQUFXLEVBQzFCLGFBQWEsR0FWeUIsVUFBYSxxQkFXbkQsVUFBVTtRQUNSLEtBQUssRUFBTCxLQUFLO1FBQ0wsU0FBUyxFQUFULFNBQVM7UUFDVCxZQUFZLEVBQVosWUFBWTtRQUNaLGFBQWEsRUFBYixhQUFhOztRQUdqQixLQUFLO1FBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVO1lBQ3RCLEtBQUssRUFBTCxLQUFLOzs7UUFJTCxhQUFhO1lB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