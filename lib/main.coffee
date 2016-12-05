winston = require 'winston'
_				= require 'underscore'
util		= require 'util'


printTimestamp = ->
	tz_la = require("timezone")(require("timezone/America/Los_Angeles"))
	now = new Date()
	return "#{tz_la(now, '%a %T', 'America/Los_Angeles')}.#{now.getMilliseconds()}"


getConvertedLevel = (l)->
	if l is "log"
		return "_log"
	return l


class Logger
	constructor: (level)->
		options = 
			level: getConvertedLevel(level or 'log')
			colorize: true
			handleExceptions: false
			timestamp: printTimestamp

		consoleTransport = new (winston.transports.Console)(options)
		@logger = new winston.Logger(transports: [consoleTransport])

		# note log, trace renamed to _log, _traze to avoid conflict with existing methods
		levels = _log: 0, info: 1, warn: 2, error: 3
		colors = _log: "black", info: "green", warn: "orange", error: "red"
		winston.addColors colors

		@logger.setLevels(levels)

		@log = @logger._log
		@info = @logger.info
		@warn = @logger.warn


		wrapme = @logger.error
		@error = (err)=>
			if err.stack
				wrapme.call @logger, err.stack
			else
				wrapme.call @logger, err
	
	addLogFile: (config)->
		options = 
			json: false
			maxsize: 10 * 1024 * 1024
			maxFiles: 2
			level: 'log'
		if config.filename	
			_.extend  options, config

			options.level = getConvertedLevel(options.level)
			@logger.add winston.transports.File, options
		else
			@logger.warn util.format("WARNING Missing filename in log file config: %j", config)


logger = new Logger()


module.exports = logger