/// <reference path="../typings/all.d.ts" />
var winston = require('winston');
var config = require('winston/lib/winston/config');
var Logger = (function () {
    function Logger() {
    }
    Logger.setTransports = function (transports) {
        Logger._logger = new winston.Logger({ transports: transports });
    };
    Logger.silly = function (where, msg, meta) {
        if (meta === void 0) { meta = {}; }
        this._enrichMetadata(where, meta);
        this._logger.log('silly', msg, meta);
    };
    Logger.debug = function (where, msg, meta) {
        if (meta === void 0) { meta = {}; }
        this._enrichMetadata(where, meta);
        this._logger.log('debug', msg, meta);
    };
    Logger.info = function (where, msg, meta) {
        if (meta === void 0) { meta = {}; }
        this._enrichMetadata(where, meta);
        this._logger.log('info', msg, meta);
    };
    Logger.warn = function (where, msg, meta) {
        if (meta === void 0) { meta = {}; }
        this._enrichMetadata(where, meta);
        this._logger.log('warn', msg, meta);
    };
    Logger.error = function (where, msg, meta) {
        if (meta === void 0) { meta = {}; }
        this._enrichMetadata(where, meta);
        this._logger.log('error', msg, meta);
    };
    Logger._enrichMetadata = function (where, meta) {
        if (meta === void 0) { meta = {}; }
        meta.where = where;
        meta.library = 'EventStore';
    };
    Logger._initializeLogger = (function () {
        var transports = [];
        var level = 'error';
        if (process.env.LOG_LEVEL) {
            level = process.env.LOG_LEVEL;
        }
        transports.push(new (winston.transports.Console)({
            colorize: 'all',
            level: level,
            formatter: function (options) {
                var msg = config.colorize(options.level, options.meta.library + ' - ' + options.level) + ': ' + (options.message ? options.message : '');
                for (var p in options.meta) {
                    if (options.meta.hasOwnProperty(p)) {
                        msg += ', ' + p + ': ' + options.meta[p];
                    }
                }
                return msg;
            }
        }));
        Logger.setTransports(transports);
    })();
    return Logger;
})();
module.exports = Logger;
