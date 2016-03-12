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

		# note log, trace renamed to _log, _traze to avoid conflict with existing methods
		levels = _traze: 0, _log: 1, info: 2, warn: 3, error: 4

		@logger.setLevels(levels)

		@trace = @logger._traze
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
		if _.isString config
			config = filename: config
		if config.filename	
			_.extend  options, config
			@logger.add winston.transports.File, options
		else
			@logger.warn util.format("WARNING Missing filename in log file config: %j", config)


logger = new Logger()

process.on 'uncaughtException', (err)->
	logger.error '*** uncaughtException ***'
	logger.error err

module.exports = logger