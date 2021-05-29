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
    var clientId = options.clientId, clientHost = options.clientHost, redirectURI = options.redirectURI, state = _constants.EMPTY_STATE, scope = _constants.OPEN_ID_SCOPE, client_id = clientId, redirect_uri = redirectURI, response_type = _constants.CODE_RESPONSE_TYPE, parameters = {
        "state": state,
        "scope": scope,
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": response_type
    };
    if (createAccount) {
        var create_account = createAccount; ///
        Object.assign(parameters, {
            "create_account": create_account
        });
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
    var clientId = options.clientId, clientSecret = options.clientSecret, digest = "".concat(clientId, ":").concat(clientSecret), encodedDigest = Buffer.from(digest).toString(_constants.BASE_64), accept = _contentTypes.APPLICATION_JSON_CONTENT_TYPE, contentType = _contentTypes.APPLICATION_X_WWW_FORM_ENCODED_CONTENT_TYPE, contentLength = content.length, authorisation = "Basic ".concat(encodedDigest), headers = {
        "accept": accept,
        "content-type": contentType,
        "content-length": contentLength,
        "authorization": authorisation
    };
    return headers;
}
function createContent(options, code) {
    var parameters = createParameters(options, code), queryString = queryStringFromParameters(parameters), content = queryString; ///
    return content;
}
function createParameters(options, code) {
    var redirectURI = options.redirectURI, grant_type = _constants.AUTHORIZATION_CODE_GRANT_TYPE, redirect_uri = redirectURI, parameters = {
        "code": code,
        "grant_type": grant_type,
        "redirect_uri": redirect_uri
    };
    return parameters;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vQXV0aC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IHsgUmVhZGFibGUgfSBmcm9tIFwic3RyZWFtXCI7XG5pbXBvcnQgeyBodHRwVXRpbGl0aWVzLCByZXF1ZXN0VXRpbGl0aWVzIH0gZnJvbSBcIm5lY2Vzc2FyeVwiO1xuXG5pbXBvcnQgaHR0cCBmcm9tIFwiLi9odHRwXCI7XG5cbmltcG9ydCB7IEFQUExJQ0FUSU9OX0pTT05fQ09OVEVOVF9UWVBFLCBBUFBMSUNBVElPTl9YX1dXV19GT1JNX0VOQ09ERURfQ09OVEVOVF9UWVBFIH0gZnJvbSBcIi4vY29udGVudFR5cGVzXCI7XG5pbXBvcnQgeyBST09UX1VSSSwgQkFTRV82NCwgRU1QVFlfU1RBVEUsIE9QRU5fSURfU0NPUEUsIENPREVfUkVTUE9OU0VfVFlQRSwgQVVUSE9SSVpBVElPTl9DT0RFX0dSQU5UX1RZUEUgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcblxuY29uc3QgeyBwb3N0IH0gPSByZXF1ZXN0VXRpbGl0aWVzLFxuICAgICAgeyBxdWVyeVN0cmluZ0Zyb21QYXJhbWV0ZXJzIH0gPSBodHRwVXRpbGl0aWVzO1xuXG5mdW5jdGlvbiByZWRpcmVjdChvcHRpb25zLCByZXNwb25zZSwgY3JlYXRlQWNjb3VudCA9IGZhbHNlKSB7XG4gIGNvbnN0IHsgY2xpZW50SWQsIGNsaWVudEhvc3QsIHJlZGlyZWN0VVJJIH0gPSBvcHRpb25zLFxuICAgICAgICBzdGF0ZSA9IEVNUFRZX1NUQVRFLCAvLy9cbiAgICAgICAgc2NvcGUgPSBPUEVOX0lEX1NDT1BFLCAgLy8vXG4gICAgICAgIGNsaWVudF9pZCA9IGNsaWVudElkLCAgLy8vXG4gICAgICAgIHJlZGlyZWN0X3VyaSA9IHJlZGlyZWN0VVJJLCAgLy8vXG4gICAgICAgIHJlc3BvbnNlX3R5cGUgPSBDT0RFX1JFU1BPTlNFX1RZUEUsIC8vL1xuICAgICAgICBwYXJhbWV0ZXJzID0ge1xuICAgICAgICAgIFwic3RhdGVcIiA6IHN0YXRlLFxuICAgICAgICAgIFwic2NvcGVcIiA6IHNjb3BlLFxuICAgICAgICAgIFwiY2xpZW50X2lkXCIgOiBjbGllbnRfaWQsXG4gICAgICAgICAgXCJyZWRpcmVjdF91cmlcIiA6IHJlZGlyZWN0X3VyaSxcbiAgICAgICAgICBcInJlc3BvbnNlX3R5cGVcIiA6IHJlc3BvbnNlX3R5cGVcbiAgICAgICAgfTtcblxuICBpZiAoY3JlYXRlQWNjb3VudCkge1xuICAgIGNvbnN0IGNyZWF0ZV9hY2NvdW50ID0gY3JlYXRlQWNjb3VudDsgLy8vXG5cbiAgICBPYmplY3QuYXNzaWduKHBhcmFtZXRlcnMsIHtcbiAgICAgIFwiY3JlYXRlX2FjY291bnRcIjogY3JlYXRlX2FjY291bnRcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IHF1ZXJ5U3RyaW5nID0gcXVlcnlTdHJpbmdGcm9tUGFyYW1ldGVycyhwYXJhbWV0ZXJzKSxcbiAgICAgICAgbG9jYXRpb24gPSBgJHtjbGllbnRIb3N0fT8ke3F1ZXJ5U3RyaW5nfWA7XG5cbiAgaHR0cC5yZWRpcmVjdChyZXNwb25zZSwgbG9jYXRpb24pO1xufVxuXG5mdW5jdGlvbiBjYWxsYmFjayhvcHRpb25zLCBjb2RlLCBjYWxsYmFjaykge1xuICBjb25zdCB7IGNsaWVudEhvc3QgfSA9IG9wdGlvbnMsXG4gICAgICAgIGNvbnRlbnQgPSBjcmVhdGVDb250ZW50KG9wdGlvbnMsIGNvZGUpLFxuICAgICAgICBoZWFkZXJzID0gY3JlYXRlSGVhZGVycyhvcHRpb25zLCBjb250ZW50KSxcbiAgICAgICAgaG9zdCA9IGNsaWVudEhvc3QsICAvLy9cbiAgICAgICAgdXJpID0gUk9PVF9VUkksXG4gICAgICAgIHBhcmFtZXRlcnMgPSB7fSwgIC8vL1xuICAgICAgICByZWFkYWJsZSA9IFJlYWRhYmxlLmZyb20oY29udGVudCk7XG5cbiAgcmVhZGFibGUucGlwZShwb3N0KGhvc3QsIHVyaSwgcGFyYW1ldGVycywgaGVhZGVycywgKGVycm9yLCByZW1vdGVSZXNwb25zZSkgPT4ge1xuICAgIGxldCBhY2Nlc3NUb2tlbiA9IG51bGw7XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCBhY2Nlc3NUb2tlbik7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBodHRwLmJvZHlGcm9tUmVzcG9uc2UocmVtb3RlUmVzcG9uc2UsIChib2R5KSA9PiB7XG4gICAgICBsZXQganNvbjtcblxuICAgICAgY29uc3QganNvblN0cmluZyA9IGJvZHk7ICAvLy9cblxuICAgICAgdHJ5IHtcbiAgICAgICAganNvbiA9IEpTT04ucGFyc2UoanNvblN0cmluZyk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgYWNjZXNzVG9rZW4pO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBhY2Nlc3NfdG9rZW4gPSBudWxsfSA9IGpzb247XG5cbiAgICAgIGFjY2Vzc1Rva2VuID0gYWNjZXNzX3Rva2VuOyAvLy9cblxuICAgICAgY2FsbGJhY2soZXJyb3IsIGFjY2Vzc1Rva2VuKTtcbiAgICB9KTtcbiAgfSkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHJlZGlyZWN0LFxuICBjYWxsYmFja1xufTtcblxuZnVuY3Rpb24gY3JlYXRlSGVhZGVycyhvcHRpb25zLCBjb250ZW50KSB7XG4gIGNvbnN0IHsgY2xpZW50SWQsIGNsaWVudFNlY3JldCB9ID0gb3B0aW9ucyxcbiAgICAgICAgZGlnZXN0ID0gYCR7Y2xpZW50SWR9OiR7Y2xpZW50U2VjcmV0fWAsXG4gICAgICAgIGVuY29kZWREaWdlc3QgPSBCdWZmZXIuZnJvbShkaWdlc3QpLnRvU3RyaW5nKEJBU0VfNjQpLFxuICAgICAgICBhY2NlcHQgPSBBUFBMSUNBVElPTl9KU09OX0NPTlRFTlRfVFlQRSxcbiAgICAgICAgY29udGVudFR5cGUgPSBBUFBMSUNBVElPTl9YX1dXV19GT1JNX0VOQ09ERURfQ09OVEVOVF9UWVBFLFxuICAgICAgICBjb250ZW50TGVuZ3RoID0gY29udGVudC5sZW5ndGgsXG4gICAgICAgIGF1dGhvcmlzYXRpb24gPSBgQmFzaWMgJHtlbmNvZGVkRGlnZXN0fWAsXG4gICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgXCJhY2NlcHRcIiA6IGFjY2VwdCxcbiAgICAgICAgICBcImNvbnRlbnQtdHlwZVwiIDogY29udGVudFR5cGUsXG4gICAgICAgICAgXCJjb250ZW50LWxlbmd0aFwiIDogY29udGVudExlbmd0aCxcbiAgICAgICAgICBcImF1dGhvcml6YXRpb25cIiA6IGF1dGhvcmlzYXRpb24gLy8vXG4gICAgICAgIH07XG5cbiAgcmV0dXJuIGhlYWRlcnM7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRlbnQob3B0aW9ucywgY29kZSkge1xuICBjb25zdCBwYXJhbWV0ZXJzID0gY3JlYXRlUGFyYW1ldGVycyhvcHRpb25zLCBjb2RlKSxcbiAgICAgICAgcXVlcnlTdHJpbmcgPSBxdWVyeVN0cmluZ0Zyb21QYXJhbWV0ZXJzKHBhcmFtZXRlcnMpLFxuICAgICAgICBjb250ZW50ID0gcXVlcnlTdHJpbmc7ICAvLy9cblxuICByZXR1cm4gY29udGVudDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUGFyYW1ldGVycyhvcHRpb25zLCBjb2RlKSB7XG4gIGNvbnN0IHsgcmVkaXJlY3RVUkkgfSA9IG9wdGlvbnMsXG4gICAgICAgIGdyYW50X3R5cGUgPSBBVVRIT1JJWkFUSU9OX0NPREVfR1JBTlRfVFlQRSxcbiAgICAgICAgcmVkaXJlY3RfdXJpID0gcmVkaXJlY3RVUkksICAvLy9cbiAgICAgICAgcGFyYW1ldGVycyA9IHtcbiAgICAgICAgICBcImNvZGVcIiA6IGNvZGUsXG4gICAgICAgICAgXCJncmFudF90eXBlXCIgOiBncmFudF90eXBlLFxuICAgICAgICAgIFwicmVkaXJlY3RfdXJpXCIgOiByZWRpcmVjdF91cmlcbiAgICAgICAgfTtcblxuICByZXR1cm4gcGFyYW1ldGVycztcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQ0FBQSxVQUFZOzs7OztJQUVhLE9BQVE7SUFDZSxVQUFXO0lBRTFDLEtBQVE7SUFFa0UsYUFBZ0I7SUFDTSxVQUFhOzs7Ozs7SUFFdEgsSUFBSSxHQVBvQyxVQUFXLGtCQU9uRCxJQUFJLEVBQ0oseUJBQXlCLEdBUmUsVUFBVyxlQVFuRCx5QkFBeUI7U0FFeEIsUUFBUSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBcUI7UUFBckIsYUFBYSxHQUFiLEtBQXFCLGNBQUwsS0FBSyxHQUFyQixLQUFxQjtRQUNoRCxRQUFRLEdBQThCLE9BQU8sQ0FBN0MsUUFBUSxFQUFFLFVBQVUsR0FBa0IsT0FBTyxDQUFuQyxVQUFVLEVBQUUsV0FBVyxHQUFLLE9BQU8sQ0FBdkIsV0FBVyxFQUNuQyxLQUFLLEdBUG9HLFVBQWEsY0FRdEgsS0FBSyxHQVJvRyxVQUFhLGdCQVN0SCxTQUFTLEdBQUcsUUFBUSxFQUNwQixZQUFZLEdBQUcsV0FBVyxFQUMxQixhQUFhLEdBWDRGLFVBQWEscUJBWXRILFVBQVU7U0FDUixLQUFPLEdBQUcsS0FBSztTQUNmLEtBQU8sR0FBRyxLQUFLO1NBQ2YsU0FBVyxHQUFHLFNBQVM7U0FDdkIsWUFBYyxHQUFHLFlBQVk7U0FDN0IsYUFBZSxHQUFHLGFBQWE7O1FBR25DLGFBQWE7WUFDVCxjQUFjLEdBQUcsYUFBYSxDQUFFLENBQUcsQUFBSCxFQUFHLEFBQUgsQ0FBRztRQUV6QyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVU7YUFDdEIsY0FBZ0IsR0FBRSxjQUFjOzs7UUFJOUIsV0FBVyxHQUFHLHlCQUF5QixDQUFDLFVBQVUsR0FDbEQsUUFBUSxNQUFvQixNQUFXLENBQXpCLFVBQVUsR0FBQyxDQUFDLEdBQWMsTUFBQSxDQUFaLFdBQVc7SUFoQzlCLEtBQVEsU0FrQ2xCLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUTs7U0FHekIsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUTtRQUMvQixVQUFVLEdBQUssT0FBTyxDQUF0QixVQUFVLEVBQ1osT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUNyQyxPQUFPLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxPQUFPLEdBQ3hDLElBQUksR0FBRyxVQUFVLEVBQ2pCLEdBQUcsR0F2Q3NHLFVBQWEsV0F3Q3RILFVBQVU7T0FDVixRQUFRLEdBL0NTLE9BQVEsVUErQ0wsSUFBSSxDQUFDLE9BQU87SUFFdEMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsT0FBTyxXQUFHLEtBQUssRUFBRSxjQUFjO1lBQ25FLFdBQVcsR0FBRyxJQUFJO1lBRWxCLEtBQUs7WUFDUCxTQUFRLENBQUMsS0FBSyxFQUFFLFdBQVc7OztRQWxEaEIsS0FBUSxTQXVEaEIsZ0JBQWdCLENBQUMsY0FBYyxXQUFHLElBQUk7Z0JBQ3JDLElBQUk7Z0JBRUYsVUFBVSxHQUFHLElBQUksQ0FBRyxDQUFHLEFBQUgsRUFBRyxBQUFILENBQUc7O2dCQUczQixJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVO3FCQUNyQixNQUFLO2dCQUNaLFNBQVEsQ0FBQyxNQUFLLEVBQUUsV0FBVzs7O2dDQUtFLElBQUksQ0FBM0IsWUFBWSxFQUFaLFlBQVksOEJBQUcsSUFBSTtZQUUzQixXQUFXLEdBQUcsWUFBWSxDQUFFLENBQUcsQUFBSCxFQUFHLEFBQUgsQ0FBRztZQUUvQixTQUFRLENBQUMsS0FBSyxFQUFFLFdBQVc7Ozs7O0lBTS9CLFFBQVEsRUFBUixRQUFRO0lBQ1IsUUFBUSxFQUFSLFFBQVE7OztTQUdELGFBQWEsQ0FBQyxPQUFPLEVBQUUsT0FBTztRQUM3QixRQUFRLEdBQW1CLE9BQU8sQ0FBbEMsUUFBUSxFQUFFLFlBQVksR0FBSyxPQUFPLENBQXhCLFlBQVksRUFDeEIsTUFBTSxNQUFrQixNQUFZLENBQXhCLFFBQVEsR0FBQyxDQUFDLEdBQWUsTUFBQSxDQUFiLFlBQVksR0FDcEMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FsRjZELFVBQWEsV0FtRnRILE1BQU0sR0FwRjZFLGFBQWdCLGdDQXFGbkcsV0FBVyxHQXJGd0UsYUFBZ0IsOENBc0ZuRyxhQUFhLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFDOUIsYUFBYSxJQUFJLE1BQU0sRUFBZ0IsTUFBQSxDQUFkLGFBQWEsR0FDdEMsT0FBTztTQUNMLE1BQVEsR0FBRyxNQUFNO1NBQ2pCLFlBQWMsR0FBRyxXQUFXO1NBQzVCLGNBQWdCLEdBQUcsYUFBYTtTQUNoQyxhQUFlLEdBQUcsYUFBYTs7V0FHaEMsT0FBTzs7U0FHUCxhQUFhLENBQUMsT0FBTyxFQUFFLElBQUk7UUFDNUIsVUFBVSxHQUFHLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLEdBQzNDLFdBQVcsR0FBRyx5QkFBeUIsQ0FBQyxVQUFVLEdBQ2xELE9BQU8sR0FBRyxXQUFXLENBQUcsQ0FBRyxBQUFILEVBQUcsQUFBSCxDQUFHO1dBRTFCLE9BQU87O1NBR1AsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUk7UUFDN0IsV0FBVyxHQUFLLE9BQU8sQ0FBdkIsV0FBVyxFQUNiLFVBQVUsR0EzRytGLFVBQWEsZ0NBNEd0SCxZQUFZLEdBQUcsV0FBVyxFQUMxQixVQUFVO1NBQ1IsSUFBTSxHQUFHLElBQUk7U0FDYixVQUFZLEdBQUcsVUFBVTtTQUN6QixZQUFjLEdBQUcsWUFBWTs7V0FHOUIsVUFBVSJ9