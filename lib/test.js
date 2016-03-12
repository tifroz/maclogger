(function() {
  var logger;

  logger = require("./main");

  logger.addLogFile({
    filename: "/Users/hugo/Library/Logs/testLogger.log"
  });

  logger.log("(a) test");

}).call(this);