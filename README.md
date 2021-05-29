# Necessary

A collection of utility functions.

This package was partly inspired by [lodash](https://lodash.com/), [async](https://caolan.github.io/async/) and the like. The idea was to create utility functions that addressed some modest requirements and would result in a relatively small footprint. That said, the bare bones implementations, especially the asynchronous functions, should provide some confidence whilst debugging.

These can only be used in the browser:

* [Ajax utilities](#ajax-utilities)

These cna only be used on Node:

* [Shell utilities](#shell-utilities)
* [Logging utilities](#logging-utilities)
* [Request utilities](#request-utilities)
* [Template utilities](#template-utilities)
* [File system utilities](#file-system-utilities)
* [Configuration utilities](#configuration-utilities)

These can be used both on Node and in the browser:

* [Path utilities](#path-utilities)
* [Array utilities](#array-utilities)
* [HTTP utilities](#http-utilities)
* [Asynchronous utilities](#asynchronous-utilities)

## Installation

You can install Necessary with [npm](https://www.npmjs.com/):

    npm install necessary

You can also clone the repository with [Git](https://git-scm.com/)...

    git clone https://github.com/djalbat/necessary.git

...and then install the dependencies with npm from within the project's root directory:

    npm install

## Usage

Each of the collections of utility functions described below is exported as a plain old JavaScript object. To get hold of them, import the requisite object and then destructure it:

```
import { arrayUtilities, asynchronousUtilities, fileSystemUtilities } from "necessary";

const { first, last } = arrayUtilities,
      { isDirectory } = fileSystemUtilities;

...
```
The miscellaneous functions are a special case. They can be treated as above but may well have other functions assigned to them. See below.

## Ajax utilities

- `get()`
- `post()`
- `request()`

The first two `get()` and `post()` functions make use of the third `request()` function, which is more generic and can be used for arbitrary HTTP request methods.

* The `get()` function sends a `GET` request, taking `host`, `uri`, `parameters` and `callback` arguments, together with an optional `headers` argument before the `callback` argument.

The `parameters` argument should be a plain old JavaScript object, the names and values of which are encoded and concatenated to form the query string.

The `headers` argument should also be a plain old JavaScript object. If it does not have an `accept` property then one wil be provided with the value `application/json`.

The `callback` argument is expected to be a function taking `body` and `status` arguments. If the `accept` property of the main `headers` argument is set to `application/json` then the callback function's `body` argument can be assumed to be JSON, or `null` if the request body cannot be parsed as such. The `status` argument will be the response status code, for example `200` for a successful `OK` response.

```
const host = "...",
      uri = "...",
      parameters = {
        ...
      };

get(host, uri, parameters, (json, status) => {
  if (status === 200) {
    ...
  }
});
```

Note that the `uri` argument must include a leading forward slash `/` since the `host` argument should not have a trailing one.

* The `post()` function behaves almost identically to the `get()` function, with the following differences.

It sends a `POST` rather than a `GET` request. There is an additional `body` argument that comes after the `parameters` argument. If the `headers` argument does not have a `content-type` property then one will be provided with the value of `application/json`. If the `content-type` property of the `headers` argument is set to `application/json` then the `body` argument is assumed to be a plain old JavaScript object and is stringified as JSON.

```
const host = "...",
      uri = "...",
      parameters = {
        ...
      },
      json = {
        ...
      };

post(host, uri, parameters, json, (json, status) => {
  if (json !== null) {
    ...
  }
});
```

* The `request()` function behaves similarly to the `post()` function but the `headers` argument is no longer optional and there is a `method` argument that comes before the `body` argument:

```
const host = "...",
      uri = "...",
      parameters = {
        ...
      },
      method = "PUT"
      json = {
        ...
      },
      headers = {
        "accept": "application/json",
        "content-type": "application/json"
      };

request(host, uri, parameters, method, json, headers, (json, status) => {
  if (json !== null) {
    ...
  }
});
```
Note that the headers must be explicitly set. There does not necessarily have to be a `content-type` header, of course, although in the vast majority of cases the `accept` header should be set.

## Shell utilities

- `onETX()`
- `prompt()`

Functions that can be used for Node applications running in a shell window.

* The `onETX()` function takes a handler which is invoked whenever the `ETX` character code is encountered in the `stdin` stream, which typically happens when the user presses `Ctrl-C`. This method is therefore useful for exiting a console application immediately upon the user's behest, if it is passed `process.exit`. It also returns a function that can be called to remove the listener at some later point in time:

```
const offEXT = onEXT(process.exit);

...

offEXT();
```

* The `prompt()` function is meant for use in shell applications. It takes a plain old JavaScript `options` object and a `callback` function as the its first and second arguments, respectively:

```
const hidden = true,
      answer = ...,
      description = ...,
      errorMessage = ...,
      validationFunction = ...,
      options = {
        hidden,
        answer,
        description,
        errorMessage,
        validationFunction
      };

prompt(options, (answer) => {
  ...
});
```

There are a range of properties available for the `options` object. The `description` and `errorMessage` properties are mandatory. The remaining properties are optional.

The default values of the `attempts` and `encoding` properties are `3` and `utf8`, respectively. The default value of the `hidden` property is `false`. Setting it to `true` results in password-style input, that is, the characters remain hidden.

If no `validateFunction` property is given then you must set a `validatePattern` property instead, which must be a regular expression.

The `initialAnswer` property sets the initial answer at the prompt. You might want to set it to `yes`, for example. Lastly, setting the `answer` property to anything other than `null` or `undefined` causes the `callback` function to be invoked immediately without any prompt being shown. This can be useful for debugging.

## Logging utilities

- `log()`

A single `log()` function for basic logging purposes.

* The `log()` function provides rudimentary logging functionality, printing its argument to the console, prepended with a date and time stamp together with the path of the file containing the callee function and the line number:

```
log("...") // Results in '28-01-2018 15:44:47.363 bin/main.js(35) ...' being logged.
```

You can pass an error instead of a string to `log()`, in which case it will print the file path and line number of the place where the error was thrown along with the error message.

Additionally, it is possible to print to a log file if a log directory and, optionally, a base name for the log file are specified. The base name here means the file name minus the extension and separator. The default is `default`:

```
const { setLogFileBaseName, setLogDirectoryPath } = log;

setLogFileBaseName("example");
setLogDirectoryPath("./log");

log("...") // Results in '28-01-2018 15:44:47.363 bin/main.js(35) ...\n' line being appended to
           // the './log/example.log' file as well as the message being logged.
```

A standard set of functions, namely `fatal()`, `error()`, `warning()`, `info()`, `debug()` and `trace()`, are available and these are filtered in the usual way, assuming the log level has been set:

```
const { setLogLevel, DEBUG } = log;

setLogLevel(DEBUG);

log.error("...") // Printed to the console and optionally, to the log file.
log.trace("...") // Ignored, because the trace level is lower than the debug level.
```

There is also a `setLogOptions()` function which allows you to pass the log level, base file name and directory path as a plain old JavaScript object. See below for a usage example.

Finally, log files are rolled over every night. So `./log/example.log` would become `./log/example.28-01-2018.log` and a new `./log/example.log` file would be started at midnight.

## Request utilities

- `get()`
- `post()`
- `request()`

Functions that leverage Node's [HTTP](https://nodejs.org/api/http.html) nad [HTTPS](https://nodejs.org/api/https.html) inbuilt modules in order to provide HTTP request functionality. These functions are deliberately low level. They will take away some of the pain of using the aforementioned modules but will not automatically set headers, parse responses, etc. For all but the most basic of requests you will likely need some knowledge of streams and Node's inbuilt request and response objects.

* The `get()` function provides a means to make GET requests. It takes `host`, `uri` and `parameters` arguments, an optional `headers` argument and a `callback` argument. It returns an instance of Node's [ClientRequest](https://nodejs.org/api/http.html#http_class_http_clientrequest) class and the callback function should have an `error` argument, which will be `null` if the request is successful, and a `response` argument, which will be an instance of Node's [IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) class.

As mentioned above, the `get()` method will not parse the response. In the following example there is a `bodyFromResponse()` function that will do this for simple cases when the body of the response is Unicode:

```
get(host, uri, parameters, (error, response) => {
  // Check for an error

  const { statusCode } = response;

  // Check the status code

  bodyFromResponse(response, (body) => {
    console.log(body)
  });
});

function bodyFromResponse(response, callback) {
  let body = "";

  response.on("data", (data) => {
    body += data;
  });

  response.on("end", () => {
    callback(body);
  });
}
```

Note that the data returned when the "data" event is handled will be a byte array. It is coerced to string by the "+=" operator which, as already mentioned, will only work in the cases that Unicode data has been returned.

In the following example, the response is assumed to be binary data, an image say, and is piped straight to a file:

```
const fs = require("fs");

get(host, uri, parameters, (error, response) => {
  // Check for an error

  const { statusCode } = response;

  // Check the status code

  const writeStream = fs.createWriteStream("...");

  response.pipe(writeStream);
});
```

* The `post()` function provides a means to make POST requests. Its arguments are identical to the `get()` function.

In the following example the `queryStringFromParameters()` function from the HTTP utilities is used to encode the content. Note that the `content-type` and `content-length` headers must be set explicitly. Also note that there is no argument provided for the content itself, instead an instance of Node's [`Readable`](https://nodejs.org/api/stream.html#stream_class_stream_readable) class is created and piped to the request:

```
const { Readable } = require("stream");

const content = queryStringFromParameters({
        "name": "John Doe"
      }),
      headers = {
        "content-type": "application/x-www-form-urlencoded",
        "content-length": content.length
      };

const request = post(host, uri, parameters, headers, (error, response) => {
        // Check for an error

        const { statusCode } = response;

        // Check the status code

        ...
      }),
      readable = Readable.from(content);

readable.pipe(request);
```

* The `delete()` function provides a means to make arbitrary HTTP requests. Its arguments are identical to the `post()` function bar an additional `method` argument that comes after the `parameters` argument, which in this case is not optional.

## Template utilities

- `parseFile()`
- `parseContent()`
- `parseLine()`

These functions parse files, content or single lines, replacing each token of the form `${<name>}` with the value of the corresponding property of a plain old JavaScript object passed as the second argument, or replacing the token with an empty string if no such property exists.

* The `parseFile()` function takes a file path as the first argument:

```
const filePath = "/etc/var/public/name.html",
      name = "Joe Bloggs",
      age = 99,
      args = {
        name,
        age
      }
      parsedContent = parseFile(filePath, args);
```

* The `parseContent()` function takes content as the first argument, honouring newline `\n` characters:

```
const content = `

  name: <strong>${name}</strong><br/>
  age: <strong>${age}</strong><br/>

      `,
      name = "Joe Bloggs",
      age = 99,
      args = {
        name,
        age
      }
      parsedContent = parseContent(content, args);
```

* The `parseLine()` function takes a single line of content as the first argument:

```
const line = "${name}, aged ${age}.",
      name = "Joe Bloggs",
      age = 99,
      args = {
        name,
        age
      }
      parsedLine = parseLine(line, args); // returns 'Joe Bloggs, aged 99.'
```

## File system utilities

- `checkEntryExists()`
- `checkFileExists()`
- `checkDirectoryExists()`
- `isEntryFile()`
- `isEntryDirectory()`
- `isDirectoryEmpty()`
- `readDirectory()`
- `readFile()`
- `writeFile()`
- `appendToFile()`
- `createDirectory()`
- `renameFile()`
- `getStats()`

An inglorious collection of functions which do no more than paper over some of Node's synchronous [native file system API](https://nodejs.org/api/fs.html) functions. All of the functions will throw native errors upon failure.

* The `checkEntryExists()`, `checkFileExists()`, `checkDirectoryExists()`, `isEntryFile()`, `isEntryDirectory()` and `isDirectoryEmpty()` functions work as their names suggest, returning a boolean value.

```
checkEntryExists("root/etc"); // returns true if the file or directory exists

checkFileExists("root/etc/init.conf"); // returns true if the file exists

checkDirectoryExists("root/etcconf"); // returns true if the directory exists

isEntryFile("root/etc/init.conf"); // returns true if the entry is a file

isEntryDirectory("root"); // returns true if the entry is a directory

isDirectoryEmpty("root/etc"); // returns true if the directory is empty
```

* The `readDirectory()` function returns an array of entry names if the directory exists:

```
readDirectory("root/etc"); // returns the contents of the 'root/etc' directory
```

* The `readFile()` function takes the file encoding as an optional second string argument. The default is `utf8`. It returns the content of the file upon success:

```
readFile("root/etc/init.conf"); // returns the content of the 'root/etc/init.conf' file
```

* The `writeFile()` function takes the content of the file as a second string argument. It does not return anything upon success:

```
writeFile("root/etc/init.conf", ""); // writes '' to the 'root/etc/init.conf' file
```

* The `appendToFile()` function takes the content to append file as a second string argument. It will create teh file if necessary and does not return anything upon success:

```
appendToFile("root/etc/init.conf", ""); // appends '' to the 'root/etc/init.conf' file
```

* The `createDirectory()` function creates a directory, also creating the parent directories if necessary:

```
createDirectory("root/etc/init"); // Creates the 'root/etc/init' directory
```

* The `getStats()` function returns an instance of the [fs.Stats](https://nodejs.org/api/fs.html#fs_class_fs_stats) class for a file or a directory:

```
const stats = getStats("root/etc"); // returns stats for the 'root/etc' directory
```

## Configuration utilities

- `rc()`

A single `rc()` function for runtime configuration.

* The `rc()` function parses a JSON runtime configuration file of a certain format and provides the information therein by assigning it to itself:

```
rc();

const { logOptions } = rc;

setLogOptions(logOptions); // Expects a plain old JavaScript object of the form { level,
                           //                                                     fileBaseName,
                           //                                                     directoryPath }
```

By default it will parse a file called `.rc` in the current working directory. This file should have the following format:

```
{
  "environments": [
    {
      "name": "development",
      ...
    },
    {
      "name": "production",
      ...
    }
  ]
}
```

In the absence of being passed an environment name, it will parse and return the first element of the `enviromnents` array. It will not try to assign the `name` property of the chosen environment to itself, by the way, because functions already have a `name` property. It can be instructed to a chose a specific environment thus:

```
rc("production"); // Provides the 'production' environment
```

Or you can pass `process.argv` if the command line arguments include something of the form `--environment=...`:

```
rc(process.argv); // Provides the 'development' if given '--environment=development'
```

You can change the base extension of the file that is parsed, that is the part of the extension between the leading dot and `rc`, by making use of the `setRCBaseExtension()` function:

```
const { setRCBaseExtension } = rc;

setRCBaseExtension("default");

rc(); // Provides the first environment in the '.defaultrc' file
```

Note that the `rc()` function can be included in any file but only needs to be called once. But be careful that it is called before it is ever destructured.

Aside from the aforementioned `setRCBaseExtension()` functions, the `checkRCFileExists()`, `createVacuousRCFile()`, `readRCFile()` and `writeRCFile()` functions do as their names suggest. The `updateRCFile()` function, if passed a plain old JavaScript object as the first parameter, will add the properties therein, overwriting any existing properties. Properties to be removed can be given as further arguments. If you do not want to add as well as remove properties, set the first argument to a falsey value.

```
const { readRCFile, writeRCFile, updateRCFile, checkRCFileExists, createVacuousRCFile } = rc;

const rcFileExists = checkRCFileExists();  // Returns true if the rc file exists.

createVacuousRCFile(); // creates an rc file with an empty environment.

const json = readRCFile();  // Reads the entire contents of the rc file into a JSON object

writeRCFile(json);  // Stringifies the given JSON object and writes it to the rc file

updateRCFile({example: "example"});  // Updates the rc file, adding the 'example' property

updateRCFile(null, "example");  // Updates the rc file, removing the 'example' property
```

## Path utilities

- `isPathName()`
- `isPathTopmostName()`
- `isPathRelativePath()`
- `isPathAbsolutePath()`
- `isTopmostNameInAbsolutePath()`
- `combinePaths()`
- `concatenatePaths()`
- `bottommostNameFromPath()`
- `topmostDirectoryPathFromPath()`
- `topmostDirectoryNameFromPath()`
- `pathWithoutBottommostNameFromPath()`
- `pathWithoutTopmostDirectoryNameFromPath()`

These functions manipulate or query strings that represent file and directory paths. Note that only forward slash `/` delimiters are supported. Trailing delimiters are not needed, but tolerated.

* The `isPathName()` function returns `true` if the string argument contains no `/` delimiters apart from the first and last characters:

```
isPathName("root/"); // returns true

isPathName("/root"); // returns true

isPathName("./root"); // returns false

isPathName("../etc"); // returns false

isPathName("/root/etc"); // returns false
```

* The `isPathTopmostName()` function returns `true` if the string argument is both a name and an absolute path:

```
isPathTopmostName("/root/"); // returns true

isPathTopmostName("/root"); // returns true

isPathTopmostName("etc/"); // returns false
```

* The `isPathRelativePath()` function returns `true` if the string argument does not start with a delimiter`/`:

```
isPathRelativePath("etc"); // returns true

isPathRelativePath("./etc"); // returns true

isPathRelativePath("../etc"); // returns true
```

* The `isPathAbsolutePath()` returns `true` if the string argument starts with a delimiter`/`:

```
isPathAbsolutePath("/root/etc"); // returns true
```

* The `isTopmostNameInAbsolutePath()` function returns `true` if the second string argument begins with the first string argument optionally followed by a delimiter`/` and further characters:

```
isTopmostNameInAbsolutePath("/root", "/root/etc");  // returns true

isTopmostNameInAbsolutePath("root", "/root/etc");  // returns false

isTopmostNameInAbsolutePath("etc", "/root/etc"); // returns false
```

Note that the function assumes that the first argument is a topmost name and that the second argument is an abolute path. It does not check, it simply compares the two arguments with a single regex.

* The `combinePaths()` function will combine the first string argument with the second string argument by successively removing the bottommost directory name of the former for each topmost parent directory `..` signifier it finds in the latter. Current directory `.` signifiers are also removed:

```
combinePaths("etc/", "./init"); // returns 'etc/init'

combinePaths("/root/etc/", "../init"); // returns '/root/init'
```

Note that the function assumes that the second argument is a relative name or path.

* The `concatenatePaths()` function will concatenate the first and second string arguments, adding the trailing forward slash `/` to the first string if necessary:

```
concatenatePaths("root", "etc/"); // returns 'root/etc/'

concatenatePaths("root/", "etc/"); // returns 'root/etc/'
```

Note that the function assumes that the second argument is a relative name or path although without a leading current directory `.` or parent directory `..` signifier.

* The `bottommostNameFromPath()`, `topmostDirectoryPathFromPath()`, `topmostDirectoryNameFromPath()`, `pathWithoutBottommostNameFromPath()` and `pathWithoutTopmostDirectoryNameFromPath()` functions work as their names suggest. Each expects there to be at least one delimiter, returning `null` otherwise:

```
bottommostNameFromPath("../etc"); // returns 'etc'

topmostDirectoryPathFromPath("/root/etc/init.conf"); // returns '/root/etc'

topmostDirectoryNameFromPath("etc/init.conf"); // returns 'etc'

pathWithoutBottommostNameFromPath("root/etc/init.conf"); // returns 'root/etc'

pathWithoutTopmostDirectoryNameFromPath("root/etc/init.conf"); // returns 'etc/init.conf'
```

## Array utilities

- `first()`
- `second()`
- `third()`
- `fourth()`
- `fifth()`
- `fifthLast()`
- `fourthLast()`
- `thirdLast()`
- `secondLast()`
- `last()`
- `head()`
- `tail()`
- `push()`
- `unshift()`
- `concat()`
- `clear()`
- `copy()`
- `merge()`
- `splice()`
- `replace()`
- `filter()`
- `find()`
- `prune()`
- `patch()`
- `augment()`
- `separate()`

Note that none of these functions take or pass on a `thisArg` argument when they might otherwise have done. Use `bind()`.

* The functions `first()` through to `last()` return the requisite element of the array argument, if passed an array of at least the required length. If the array is not long enough they return `undefined`. The `head()` function returns the first element of its array argument whilst The `tail()` function returns all but the first element of its array argument.

* The `push()` function is similar to its native counterpart but will push an array rather than a single element.

* The `unshift()` function is similar to its native counterpart but will unshift an array rather than a single element.

* The `concat()` function is similar to its native counterpart, however it alters the first array argument *in place*. Like its native counterpart it will also take a single element as the second argument and convert it to an array.

```
concat([1, 2, 3], 4); // the array argument becomes [1, 2, 3, 4]
```

* The `clear()` function removes all the elements in the array argument and returns them as a fresh array:

```
clear([1, 2, 3]); // the array argument becomes []
                  // returnsll be [1, 2, 3]
```

* The `copy()` function copies the second array argument over the top of the first array argument, in other words it replaces each element of the first array argument with the corresponding element in the second array argument. If there are more elements in the second array argument that the first, the first is lengthened:

```
copy([1, 2, 3], [4, 5, 6, 7]); // the first array argument becomes [4, 5, 6, 7]
```

* The `merge()` function copies the second array argument onto to the end of the first array argument, behaving in identical fashion to the `push()` function:

```
merge([1, 2, 3], [4, 5, 6, 7]); // the first array argument becomes [1, 2, 3, 4, 5, 6, 7]
```

* The `splice()` function works in a similar vein to its native counterpart, however it takes an array as the optional fourth argument rather than a series of elements from the fourth argument onwards. It mutates the first array argument and returns an array of the elements that have been removed from it:

```
splice([1, 2, 3], 1, 2, [4, 5]); // returnsll be [2, 3]
                                 // the first array argument becomes [1, 4, 5]
```

* The `replace()` function will replace an element in the array with the given element the first time that the test callback function returns a truthy value:

```
replace([1, 2, 0, -1, -2], 3, (element, index) => {
  return element === 0;
}); // the first array argument becomes [1, 2, 3, -1, -2]
```

* The `filter()` function is like its native counterpart, however it filters the first array argument *in place*. The second argument should be a test callback function that will be invoked for each element of the array. If it does not return a truthy value, the corresponding element will be removed.

```
filter([1, 2, -1, -2], (element, index) => {
  return element > 0;
}); // the first array argument becomes [1, 2]
    // returns [-1, -2]
```

* The `find()` function is like its native counterpart, however it returns an array of all the elements for which the test callback function returns a truthy value, rather than just the first:

```
find([1, 2, -1, -2], (element, index) => {
  return element > 0;
}); // returnsll be [1, 2]
```

* The `prune()` function is much like the `filter()` function, however it will terminate the first time that the test callback function does not return a truthy value:

```
prune([1, 2, -1, -2], (element, index) => {
  return element > 0;
}); // the first array argument becomes [1, 2, -2]
    // returns -1
```

* The `patch()` function will append the given element to the first array argument the first time that the test callback function returns a truthy value:

```
patch([1, 2, 0, -1, -2], 4, (element, index) => {
  return element === 0;
}); // the first array argument becomes [1, 2, 0, -1, -2, 4]
```

* The `augment()` function is appends each of the elements of the second array argument to the first array argument whenever the test callback returns a truthy value:

```
augment([1, 2, 3], [-1, 4, -2, 5], (element, index) => {
  return element > 0;
}); // the first array argument becomes [1, 2, 3, 4, 5]
```

* The `separate()` function separates the first array argument, pushing each of its elements onto either the second or the third array argument depending on whether or not the test callback returns a truthy value:

```
separate([1, -1, -2, 2, 3, -3], [], [], (element, index) => {
  return element > 0;
}); // the second and third array arguments become [1, 2, 3] and [-1, -2, 3], respectively.
```

## HTTP utilities

- `overwrite()`
- `underwrite()`
- `portFromHost()`
- `secureFromHost()`
- `hostnameFromHost()`
- `queryStringFromParameters()`
- `urlFromHostURIAndParameters()`

Helper functions to manipulate HTTP headers and URLs, build query strings and so on.

* The `overwrite()` function takes a plain old JavaScript object `headers` argument together with `name` and `value` string arguments. It overwrites the property of the `headers` object corresponding to the `name` argument with the `value` argument, if the property exists, otherwise it creates it. It's utility lies in the fact that it is insensitive to case.

```
const headers = {
  "Content-Type": "application/json"
};

overwrite(headers, "content-type", "text/html"); // headers["Content-Type"] = "text/html"
```

* The `underwrite()` function takes a plain old JavaScript object `headers` argument together with `name` and `value` string arguments. If the corresponding property of the \headers\ object exists then it is left in place, otherwise it is given the `value` value. It's utility lies in the fact that it is insensitive to case.

```
const headers = {
  "Content-Type": "application/json"
};

underwrite(headers, "content-type", "text/html"); // headers["Content-Type"] = "application/jon"

const headers = {};

underwrite(headers, "content-type", "text/html"); // headers["content-type"] = "text/html"
```

* The `portFromHost()` extracts the port from the `host` argument if it is specified explicitly otherwise it returns 443 for secure hosts, 80 otherwise.

```
portFromHost("http://site.com"); // returns 80

portFromHost("https://site.com"); // returns 443

portFromHost("http://localhost:8080"); // returns 8080
```

* The `secureFromHost()` returns `true` if the protocol of the given `host` argument is `https://`, `false` otherwise.

```
secureFromHost("http://localhost"); // returns false

secureFromHost("https://site.com"); // returns true
```

* The `hostnameFromHost()` returns the hostname part of the `host` argument, removing the protocol but leaving the port if present.

```
hostnameFromHost("http://site.com"); // returns "site.com"
```

* The `queryStringFromParameters()` function takes a plain old JavaScript object `parameters` argument and returns the corresponding URL encoded query string. It uses the [`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) to encode the names and values

```
const parameters = {
  "name": "John Doe"
};

queryStringFromParameters(parameters); // returns John%20Doe
```

* The `urlFromHostURIAndParameters()` function takes `host` and `uri` string arguments together with a `parameters` plain old JavaScript object argument. It creates a query string from the `parameters` object and concatenates this with the two other arguments in oder to create a fully qualified HTTP URL.

```
const host = "https://site.com",
      uri = "/user",
      parameters = {
        "name": "John Doe"
      };

urlFromHostURIAndParameters(host, uri, parameters); // returns "https://site.com/user?name=John%20Doe"
```

Ideally the `host` argument should not include a trailing forward slash whereas `uri` arguments should always start with a leading forward slash.

## Asynchronous utilities

- `whilst()`
- `forEach()`
- `sequence()`
- `eventually()`
- `repeatedly()`

These functions generally take either a callback or an array of callbacks, followed by a `done()` function and an optional `context` argument. They all pass a `next()` function to the callbacks followed by the `done()` function, the `context` and then an `index` argument. Callbacks are given access to the `done()` function which can be called instead of the `next()` function in order to terminate early.

* The `whilst()` function takes a single callback, which it calls each time the callback invokes the given `next()` function or until the callback invokes the given `done()` function. The callback can also force termination by returning a truthy value, in which case it must *not* call the given `next()` or `done()` functions. In the example below the callback will be executed ten times:

```
const context = {}; ///

const callback = (next, done, context, index) => {
  const terminate = (index === 9);

  if (terminate) {
    done();
  } else {
    ...

    next();
  }
}

whilst(callback, () => {
  /// done
}, context);
```

* The `forEach()` function takes an array as the first argument followed by a single callback, which it calls for each element of the array unless the callback invokes the given `done()` function. If the `done()` function is never invoked by the callback, it is called once each of the array elements has been passed to the callback, provided the callback invokes the given `next ()` function each time. In the example below the callback will be executed four times:

```
const context = {};

const callback = (element, next, done, context, index) => {
  const terminate = (element === 3);

  if (terminate) {
    done();
  } else {
    ...

    next();
  }
}

const array = [0, 1, 2, 3, 4, 5];

forEach(array, callback, () => {
  /// done
}, context);
```

* The `sequence()` function takes an array of callbacks, which it calls in turn unless the callback invokes the given `done()` function. If the `done()` function is never invoked by a callback, it is called once each of the callbacks have been called, provided each callback invokes the given `next ()` function. In the example below each of the callbacks bar the last is executed:

```
const context = {};

const firstCallback = (next, done, context, index) => { next(); },
      secondCallback = (next, done, context, index) => { next(); },
      thirdCallback = (next, done, context, index) => { done(); },
      lastCallback = (next, done, context, index) => { next(); },
      callbacks = [
        firstCallback,
        secondCallback,
        thirdCallback,
        lastCallback
      ];

sequence(callbacks, () => {
  /// done
}, context);
```

* The `eventually()` function takes an array of callbacks, each of which it calls immediately without waiting for the callbacks to invoke the given `next()` functions. When each of the callbacks has invoked the given `next()` function, it will call the `done()` function. Note that in this case invoking the `done()` function from within a callback will not halt the execution of other callbacks, it is passed as an argument only for the sake of convention. In the example below each of the callbacks is executed:

```
const context = {};

const firstCallback = (next, done, context, index) => { next(); },
      secondCallback = (next, done, context, index) => { next(); },
      thirdCallback = (next, done, context, index) => { done(); },
      callbacks = [
        firstCallback,
        secondCallback,
        thirdCallback
      ];

eventually(callbacks, () => {
  /// done
}, context);
```
* The `repeatedly()` function takes a single callback and a `length` parameter, immediately calling the callback a `length` number of times without waiting for it to invoke the given `next()` function each time. When the callback has invoked the given `next()` function a `length` number of times, it will call the `done()` function. Note that in this case invoking the `done()` function from within the callback will not halt its execution the requisite number of times, it is passed as an argument only for the sake of convention. In the example below the callback is executed ten times:

```
const context = {};

const callback = (next, done, context, index) => {
  ...

  next();
};

const length = 10;

repeatedly(callback, length, () => {
  // done
}, context);
```

## Building

Automation is done with [npm scripts](https://docs.npmjs.com/misc/scripts), have a look at the `package.json` file. The pertinent commands are:

    npm run build-debug
    npm run watch-debug

## Contact

- james.smith@djalbat.com
