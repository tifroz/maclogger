logger = require "./main"

logger.addLogFile filename: "/Users/hugo/Library/Logs/testLogger.log", level: "debug"

logger.debug "a test"