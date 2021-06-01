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
            var _access_token = json.access_token, access_token = _access_token === void 0 ? null : _access_token, _refresh_token = json.refresh_token, refresh_token = _refresh_token === void 0 ? null : _refresh_token;
            accessToken = access_token; ///
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vQXV0aC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IHsgUmVhZGFibGUgfSBmcm9tIFwic3RyZWFtXCI7XG5pbXBvcnQgeyBodHRwVXRpbGl0aWVzLCByZXF1ZXN0VXRpbGl0aWVzIH0gZnJvbSBcIm5lY2Vzc2FyeVwiO1xuXG5pbXBvcnQgaHR0cCBmcm9tIFwiLi9odHRwXCI7XG5cbmltcG9ydCB7IEFQUExJQ0FUSU9OX0pTT05fQ09OVEVOVF9UWVBFLCBBUFBMSUNBVElPTl9YX1dXV19GT1JNX0VOQ09ERURfQ09OVEVOVF9UWVBFIH0gZnJvbSBcIi4vY29udGVudFR5cGVzXCI7XG5pbXBvcnQgeyBCQVNFXzY0LFxuICAgICAgICAgRU1QVFlfU1RSSU5HLFxuICAgICAgICAgQ09OVEVOVF9UWVBFLFxuICAgICAgICAgT1BFTl9JRF9TQ09QRSxcbiAgICAgICAgIENPTlRFTlRfTEVOR1RILFxuICAgICAgICAgQ09ERV9SRVNQT05TRV9UWVBFLFxuICAgICAgICAgQVVUSE9SSVpBVElPTl9DT0RFX0dSQU5UX1RZUEUgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcblxuY29uc3QgeyBwb3N0IH0gPSByZXF1ZXN0VXRpbGl0aWVzLFxuICAgICAgeyBxdWVyeVN0cmluZ0Zyb21QYXJhbWV0ZXJzIH0gPSBodHRwVXRpbGl0aWVzO1xuXG5mdW5jdGlvbiByZWRpcmVjdChvcHRpb25zLCByZXNwb25zZSwgY3JlYXRlQWNjb3VudCA9IGZhbHNlKSB7XG4gIGNvbnN0IHsgY2xpZW50SG9zdCwgY2xpZW50SWQsIHJlZGlyZWN0VVJJLCBzdGF0ZSA9IG51bGwsIGFkZGl0aW9uYWxQYXJhbWV0ZXJzID0gbnVsbCB9ID0gb3B0aW9ucyxcbiAgICAgICAgc2NvcGUgPSBPUEVOX0lEX1NDT1BFLCAgLy8vXG4gICAgICAgIGNsaWVudF9pZCA9IGNsaWVudElkLCAgLy8vXG4gICAgICAgIHJlZGlyZWN0X3VyaSA9IHJlZGlyZWN0VVJJLCAgLy8vXG4gICAgICAgIHJlc3BvbnNlX3R5cGUgPSBDT0RFX1JFU1BPTlNFX1RZUEUsIC8vL1xuICAgICAgICBwYXJhbWV0ZXJzID0ge1xuICAgICAgICAgIHNjb3BlLFxuICAgICAgICAgIGNsaWVudF9pZCxcbiAgICAgICAgICByZWRpcmVjdF91cmksXG4gICAgICAgICAgcmVzcG9uc2VfdHlwZVxuICAgICAgICB9O1xuXG4gIGlmIChzdGF0ZSkge1xuICAgIE9iamVjdC5hc3NpZ24ocGFyYW1ldGVycywge1xuICAgICAgc3RhdGVcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChjcmVhdGVBY2NvdW50KSB7XG4gICAgY29uc3QgY3JlYXRlX2FjY291bnQgPSBjcmVhdGVBY2NvdW50OyAvLy9cblxuICAgIE9iamVjdC5hc3NpZ24ocGFyYW1ldGVycywge1xuICAgICAgY3JlYXRlX2FjY291bnRcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChhZGRpdGlvbmFsUGFyYW1ldGVycykge1xuICAgIE9iamVjdC5hc3NpZ24ocGFyYW1ldGVycywgYWRkaXRpb25hbFBhcmFtZXRlcnMpO1xuICB9XG5cbiAgY29uc3QgcXVlcnlTdHJpbmcgPSBxdWVyeVN0cmluZ0Zyb21QYXJhbWV0ZXJzKHBhcmFtZXRlcnMpLFxuICAgICAgICBsb2NhdGlvbiA9IGAke2NsaWVudEhvc3R9PyR7cXVlcnlTdHJpbmd9YDtcblxuICBodHRwLnJlZGlyZWN0KHJlc3BvbnNlLCBsb2NhdGlvbik7XG59XG5cbmZ1bmN0aW9uIGNhbGxiYWNrKG9wdGlvbnMsIGNvZGUsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IHsgY2xpZW50SG9zdCB9ID0gb3B0aW9ucyxcbiAgICAgICAgY29udGVudCA9IGNyZWF0ZUNvbnRlbnQob3B0aW9ucywgY29kZSksXG4gICAgICAgIGhlYWRlcnMgPSBjcmVhdGVIZWFkZXJzKG9wdGlvbnMsIGNvbnRlbnQpLFxuICAgICAgICBob3N0ID0gY2xpZW50SG9zdCwgIC8vL1xuICAgICAgICB1cmkgPSBFTVBUWV9TVFJJTkcsIC8vL1xuICAgICAgICBwYXJhbWV0ZXJzID0ge30sICAvLy9cbiAgICAgICAgcmVhZGFibGUgPSBSZWFkYWJsZS5mcm9tKGNvbnRlbnQpO1xuXG4gIHJlYWRhYmxlLnBpcGUocG9zdChob3N0LCB1cmksIHBhcmFtZXRlcnMsIGhlYWRlcnMsIChlcnJvciwgcmVtb3RlUmVzcG9uc2UpID0+IHtcbiAgICBsZXQgYWNjZXNzVG9rZW4gPSBudWxsLFxuICAgICAgICByZWZyZXNoVG9rZW4gPSBudWxsO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBjYWxsYmFjayhlcnJvciwgYWNjZXNzVG9rZW4pO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaHR0cC5ib2R5RnJvbVJlc3BvbnNlKHJlbW90ZVJlc3BvbnNlLCAoYm9keSkgPT4ge1xuICAgICAgbGV0IGpzb247XG5cbiAgICAgIGNvbnN0IGpzb25TdHJpbmcgPSBib2R5OyAgLy8vXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGpzb24gPSBKU09OLnBhcnNlKGpzb25TdHJpbmcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIGFjY2Vzc1Rva2VuKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgYWNjZXNzX3Rva2VuID0gbnVsbCwgcmVmcmVzaF90b2tlbiA9IG51bGwgfSA9IGpzb247XG5cbiAgICAgIGFjY2Vzc1Rva2VuID0gYWNjZXNzX3Rva2VuOyAvLy9cblxuXG4gICAgICBjYWxsYmFjayhlcnJvciwgYWNjZXNzVG9rZW4sIHJlZnJlc2hUb2tlbik7XG4gICAgfSk7XG4gIH0pKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICByZWRpcmVjdCxcbiAgY2FsbGJhY2tcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZUhlYWRlcnMob3B0aW9ucywgY29udGVudCkge1xuICBjb25zdCB7IGNsaWVudElkLCBjbGllbnRTZWNyZXQgfSA9IG9wdGlvbnMsXG4gICAgICAgIGRpZ2VzdCA9IGAke2NsaWVudElkfToke2NsaWVudFNlY3JldH1gLFxuICAgICAgICBlbmNvZGVkRGlnZXN0ID0gQnVmZmVyLmZyb20oZGlnZXN0KS50b1N0cmluZyhCQVNFXzY0KSxcbiAgICAgICAgYWNjZXB0ID0gQVBQTElDQVRJT05fSlNPTl9DT05URU5UX1RZUEUsXG4gICAgICAgIGNvbnRlbnRUeXBlID0gQVBQTElDQVRJT05fWF9XV1dfRk9STV9FTkNPREVEX0NPTlRFTlRfVFlQRSxcbiAgICAgICAgY29udGVudExlbmd0aCA9IGNvbnRlbnQubGVuZ3RoLFxuICAgICAgICBhdXRob3JpemF0aW9uID0gYEJhc2ljICR7ZW5jb2RlZERpZ2VzdH1gLFxuICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgIGFjY2VwdCxcbiAgICAgICAgICBhdXRob3JpemF0aW9uXG4gICAgICAgIH07XG5cbiAgaGVhZGVyc1tDT05URU5UX1RZUEVdID0gY29udGVudFR5cGU7XG4gIGhlYWRlcnNbQ09OVEVOVF9MRU5HVEhdID0gY29udGVudExlbmd0aDtcblxuICByZXR1cm4gaGVhZGVycztcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29udGVudChvcHRpb25zLCBjb2RlKSB7XG4gIGNvbnN0IHBhcmFtZXRlcnMgPSBjcmVhdGVQYXJhbWV0ZXJzKG9wdGlvbnMsIGNvZGUpLFxuICAgICAgICBxdWVyeVN0cmluZyA9IHF1ZXJ5U3RyaW5nRnJvbVBhcmFtZXRlcnMocGFyYW1ldGVycyksXG4gICAgICAgIGNvbnRlbnQgPSBxdWVyeVN0cmluZzsgIC8vL1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQYXJhbWV0ZXJzKG9wdGlvbnMsIGNvZGUpIHtcbiAgY29uc3QgeyByZWRpcmVjdFVSSSB9ID0gb3B0aW9ucyxcbiAgICAgICAgZ3JhbnRfdHlwZSA9IEFVVEhPUklaQVRJT05fQ09ERV9HUkFOVF9UWVBFLFxuICAgICAgICByZWRpcmVjdF91cmkgPSByZWRpcmVjdFVSSSwgIC8vL1xuICAgICAgICBwYXJhbWV0ZXJzID0ge1xuICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgZ3JhbnRfdHlwZSxcbiAgICAgICAgICByZWRpcmVjdF91cmlcbiAgICAgICAgfTtcblxuICByZXR1cm4gcGFyYW1ldGVycztcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQ0FBQSxVQUFZOzs7OztJQUVhLE9BQVE7SUFDZSxVQUFXO0lBRTFDLEtBQVE7SUFFa0UsYUFBZ0I7SUFPN0QsVUFBYTs7Ozs7O0lBRW5ELElBQUksR0Fib0MsVUFBVyxrQkFhbkQsSUFBSSxFQUNKLHlCQUF5QixHQWRlLFVBQVcsZUFjbkQseUJBQXlCO1NBRXhCLFFBQVEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQXFCO1FBQXJCLGFBQWEsR0FBYixLQUFxQixjQUFMLEtBQUssR0FBckIsS0FBcUI7UUFDaEQsVUFBVSxHQUF1RSxPQUFPLENBQXhGLFVBQVUsRUFBRSxRQUFRLEdBQTZELE9BQU8sQ0FBNUUsUUFBUSxFQUFFLFdBQVcsR0FBZ0QsT0FBTyxDQUFsRSxXQUFXLFdBQWdELE9BQU8sQ0FBckQsS0FBSyxFQUFMLEtBQUssdUJBQUcsSUFBSSxtQ0FBa0MsT0FBTyxDQUF2QyxvQkFBb0IsRUFBcEIsb0JBQW9CLHNDQUFHLElBQUksMEJBQzlFLEtBQUssR0FQaUMsVUFBYSxnQkFRbkQsU0FBUyxHQUFHLFFBQVEsRUFDcEIsWUFBWSxHQUFHLFdBQVcsRUFDMUIsYUFBYSxHQVZ5QixVQUFhLHFCQVduRCxVQUFVO1FBQ1IsS0FBSyxFQUFMLEtBQUs7UUFDTCxTQUFTLEVBQVQsU0FBUztRQUNULFlBQVksRUFBWixZQUFZO1FBQ1osYUFBYSxFQUFiLGFBQWE7O1FBR2pCLEtBQUs7UUFDUCxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVU7WUFDdEIsS0FBSyxFQUFMLEtBQUs7OztRQUlMLGFBQWE7WUFDVCxjQUFjLEdBQUcsYUFBYSxDQUFFLENBQUcsQUFBSCxFQUFHLEFBQUgsQ0FBRztRQUV6QyxNQUFNLENBQUMsTUFB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