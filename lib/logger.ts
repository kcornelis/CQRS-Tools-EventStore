/// <reference path="../typings/all.d.ts" />

import winston = require('winston');
var config = require('winston/lib/winston/config');

class Logger {

	private static _logger: winston.LoggerInstance;

	private static _initializeLogger = (() => {
		var transports = [];
		var level = 'error';

		if (process.env.LOG_LEVEL) {
			level = process.env.LOG_LEVEL;
		}

		transports.push(new (winston.transports.Console)({
			colorize: 'all',
			level: level,
			formatter: function(options) {
				var msg = config.colorize(options.level, options.meta.library + ' - ' + options.level) + ': ' +
					(options.message ? options.message : '');

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

	static setTransports(transports: any) {
		Logger._logger = new winston.Logger({ transports: transports });
	}

	static silly(where: string, msg: string, meta: any = {}) {
		this._enrichMetadata(where, meta);
		this._logger.log('silly', msg, meta);
	}

	static debug(where: string, msg: string, meta: any = {}) {
		this._enrichMetadata(where, meta);
		this._logger.log('debug', msg, meta);
	}

	static info(where: string, msg: string, meta: any = {}) {
		this._enrichMetadata(where, meta);
		this._logger.log('info', msg, meta);
	}

	static warn(where: string, msg: string, meta: any = {}) {
		this._enrichMetadata(where, meta);
		this._logger.log('warn', msg, meta);
	}

	static error(where: string, msg: string, meta: any = {}) {
		this._enrichMetadata(where, meta);
		this._logger.log('error', msg, meta);
	}

	private static _enrichMetadata(where: string, meta: any = {}) {
		meta.where = where;
		meta.library = 'EventStore';
	}
}

export = Logger;
