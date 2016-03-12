maclogger
===========

A very basic winston wrapper that duplicate the nodejs console essential API, aka log(), info(), warn(), error()

It is useful for injecting an application-specific logger into a generic function or module, for example

```
// A nodejs module

var logger = console

var myfunction(param1, optionalLogger) {
	if (optionalLogger !== undefined) {
		logger = optionalLogger
	}
	logger.log("Cool, now we are logging to the app-specific logger if it was passed as a parameter. Otherwise we're still logging to the console")
}


exports = myfunction
```

## installation

```js
npm install maclogger
```

## usage

```js


var logger = require("maclogger")


logger.log("blah")	// Just logs to the console
logger.addLogFile("~/logs/myApp.log")
logger.log("blah")	// Logs to the console and to myApp.log
logger.addLogFile({filename: "~/logs/important.log", level: "warn"}) // See winston for list of options https://github.com/winstonjs/winston#multiple-transports-of-the-same-type
logger.log("blah")	// Logs to the console, to myApp.log - but not not to important.log (important.log will only log warnings and errors)

```
