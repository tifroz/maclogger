winston = require 'winston'




class Logger
	debug: console.debug
	info: console.info
	notice: console.info
	warning: console.warn
	error: console.error
	crit: console.error
	alert: console.error
	emerg: console.error
	configure: (transportConfig)->
		transports = ( (new (winston.transports[name])(params)) for name, params of transportConfig )
		_logger = new (winston.Logger)(transports: transports)

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

		#_logger.setLevels(winston.config.syslog.levels)
		_logger.setLevels(myCustomLevels.levels)

		wrapme = _logger.error
		_logger.error = (err)->
			if err.stack
				wrapme.call _logger, err.stack
			else
				wrapme.call _logger, err

		@debug = _logger.debug
		@info = _logger.info
		@notice = _logger.notice
		@warning = _logger.warning
		@error = _logger.error
		@crit = _logger.crit
		@alert = _logger.alert
		@emerg = _logger.emerg


logger = new Logger()

process.on 'uncaughtException', (err)->
	logger.error '*** uncaughtException ***'
	logger.error err

module.exports = new Logger()