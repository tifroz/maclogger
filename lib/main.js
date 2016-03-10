(function() {
  var Logger, logger, winston;

  winston = require('winston');

  Logger = (function() {
    function Logger() {}

    Logger.prototype.debug = console.debug;

    Logger.prototype.info = console.info;

    Logger.prototype.notice = console.info;

    Logger.prototype.warning = console.warn;

    Logger.prototype.error = console.error;

    Logger.prototype.crit = console.error;

    Logger.prototype.alert = console.error;

    Logger.prototype.emerg = console.error;

    Logger.prototype.configure = function(transportConfig) {
      var myCustomLevels, name, params, transports, wrapme, _logger;
      transports = (function() {
        var _results;
        _results = [];
        for (name in transportConfig) {
          params = transportConfig[name];
          _results.push(new winston.transports[name](params));
        }
        return _results;
      })();
      _logger = new winston.Logger({
        transports: transports
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
      _logger.setLevels(myCustomLevels.levels);
      wrapme = _logger.error;
      _logger.error = function(err) {
        if (err.stack) {
          return wrapme.call(_logger, err.stack);
        } else {
          return wrapme.call(_logger, err);
        }
      };
      this.debug = _logger.debug;
      this.info = _logger.info;
      this.notice = _logger.notice;
      this.warning = _logger.warning;
      this.error = _logger.error;
      this.crit = _logger.crit;
      this.alert = _logger.alert;
      return this.emerg = _logger.emerg;
    };

    return Logger;

  })();

  logger = new Logger();

  process.on('uncaughtException', function(err) {
    logger.error('*** uncaughtException ***');
    return logger.error(err);
  });

  module.exports = new Logger();

}).call(this);