(function() {
  var Logger, logger, printTimestamp, util, winston, _;

  winston = require('winston');

  _ = require('underscore');

  util = require('util');

  printTimestamp = function() {
    var now, tz_la;
    tz_la = require("timezone")(require("timezone/America/Los_Angeles"));
    now = new Date();
    return "" + (tz_la(now, '%a %T', 'America/Los_Angeles')) + "." + (now.getMilliseconds());
  };

  Logger = (function() {
    function Logger(level) {
      var consoleTransport, myCustomLevels, options;
      options = {
        level: level || 'info',
        colorize: true,
        handleExceptions: false,
        timestamp: printTimestamp
      };
      consoleTransport = new winston.transports.Console(options);
      this.logger = new winston.Logger({
        transports: [consoleTransport]
      });
      myCustomLevels = {
        levels: {
          emerg: 7,
          alert: 6,
          crit: 5,
          error: 4,
          warning: 3,
          notice: 2,
          info: 1,
          debug: 0
        }
      };
      this.logger.setLevels(myCustomLevels.levels);
      this.debug = this.logger.debug;
      this.info = this.logger.info;
      this.notice = this.logger.info;
      this.warning = this.logger.warn;
      this.error = this.logger.error;
      this.crit = this.logger.error;
      this.alert = this.logger.error;
      this.emerg = this.logger.error;
    }

    Logger.prototype.addLogFile = function(config) {
      var options;
      options = {
        json: false,
        maxsize: 10 * 1024 * 1024,
        maxFiles: 2,
        level: 'debug'
      };
      if (config.filename) {
        _.extend(options, config);
        return winston.add(winston.transports.File, options);
      } else {
        return winston.warning(util.format("WARNING Missing filename in log file config: %j", config));
      }
    };

    return Logger;

  })();

  logger = new Logger();

  process.on('uncaughtException', function(err) {
    logger.error('*** uncaughtException ***');
    return logger.error(err);
  });

  module.exports = logger;

}).call(this);