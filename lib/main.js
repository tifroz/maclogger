(function() {
  var Logger, getConvertedLevel, logger, printTimestamp, util, winston, _;

  winston = require('winston');

  _ = require('underscore');

  util = require('util');

  printTimestamp = function() {
    var now, tz_la;
    tz_la = require("timezone")(require("timezone/America/Los_Angeles"));
    now = new Date();
    return "" + (tz_la(now, '%a %T', 'America/Los_Angeles')) + "." + (now.getMilliseconds());
  };

  getConvertedLevel = function(l) {
    if (l === "log") {
      return "_log";
    }
    return l;
  };

  Logger = (function() {
    function Logger(level) {
      var colors, consoleTransport, levels, options, wrapme;
      options = {
        level: getConvertedLevel(level || 'log'),
        colorize: true,
        handleExceptions: false,
        timestamp: printTimestamp
      };
      consoleTransport = new winston.transports.Console(options);
      this.logger = new winston.Logger({
        transports: [consoleTransport]
      });
      levels = {
        _log: 0,
        info: 1,
        warn: 2,
        error: 3
      };
      colors = {
        _log: "black",
        info: "green",
        warn: "orange",
        error: "red"
      };
      winston.addColors(colors);
      this.logger.setLevels(levels);
      this.log = this.logger._log;
      this.info = this.logger.info;
      this.warn = this.logger.warn;
      wrapme = this.logger.error;
      this.error = (function(_this) {
        return function(err) {
          if (err.stack) {
            return wrapme.call(_this.logger, err.stack);
          } else {
            return wrapme.call(_this.logger, err);
          }
        };
      })(this);
    }

    Logger.prototype.addLogFile = function(config) {
      var options;
      options = {
        json: false,
        maxsize: 10 * 1024 * 1024,
        maxFiles: 2,
        level: 'log'
      };
      if (config.filename) {
        _.extend(options, config);
        options.level = getConvertedLevel(options.level);
        return this.logger.add(winston.transports.File, options);
      } else {
        return this.logger.warn(util.format("WARNING Missing filename in log file config: %j", config));
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