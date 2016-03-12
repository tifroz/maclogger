logger = require "./main"

logger.addLogFile filename: "/Users/hugo/Library/Logs/testLogger.log", level: "log"

logger.log "(a) test"