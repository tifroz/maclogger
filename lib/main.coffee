winston = require 'winston'
_				= require 'underscore'
util		= require 'util'


printTimestamp = ->
	tz_la = require("timezone")(require("timezone/America/Los_Angeles"))
	now = new Date()
	return "#{tz_la(now, '%a %T', 'America/Los_Angeles')}.#{now.getMilliseconds()}"




class Logger
	constructor: (level)->
		options = 
			level: level or 'info'
			colorize: true
			handleExceptions: false
			timestamp: printTimestamp

		consoleTransport = new (winston.transports.Console)(options)
		@logger = new winston.Logger(transports: [consoleTransport])

		myCustomLevels =
			levels:
				emerg: 7,
				alert: 6,
				crit: 5,
				error: 4,
				warning: 3,
				notice: 2,
				info: 1,
				debug: 0

		@logger.setLevels(myCustomLevels.levels)

		@debug = @logger.debug
		@info = @logger.info
		@notice = @logger.info
		@warning = @logger.warn
		@error = @logger.error
		@crit = @logger.error
		@alert = @logger.error
		@emerg = @logger.error
	
	addLogFile: (config)->
		options = 
				json: false
				maxsize: 10 * 1024 * 1024
				maxFiles: 2
				level: 'debug'
		if config.filename	
			_.extend  options, config
			winston.add winston.transports.File, options
		else
			winston.warning util.format("WARNING Missing filename in log file config: %j", config)


logger = new Logger()

process.on 'uncaughtException', (err)->
	logger.error '*** uncaughtException ***'
	logger.error err

module.exports = logger