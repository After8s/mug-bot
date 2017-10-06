require('dotenv').config();
let winston = require('winston');
require('winston-loggly-bulk');

class Logger {

	/**
	 * Constructor
	 */
	constructor() {
		if (process.env.APP_LOGGY_TOKEN) {
			console.log('Adding Loggy');
			winston.add(winston.transports.Loggly, {
				token: process.env.APP_LOGGY_TOKEN,
				subdomain: process.env.APP_LOGGY_SUBDOMAIN,
				tags: ['Winston-NodeJS', process.env.APP_LOGGY_ENV],
				json: true
			});
		}
	}

	/**
	 * @param {String} level
	 * @param {String} message
	 * @param {Object} metadata
	 */
	log(level, message, metadata = {}) {
		winston.log(level, message, metadata);
	};

	/**
	 * @param {String} message
	 * @param {Object} metadata
	 */
	error(message, metadata = {}) {
		winston.log('error', message, metadata);
	};

	/**
	 * @param {String} message
	 * @param {Object} metadata
	 */
	info(message, metadata = {}) {
		winston.log('info', message, metadata);
	};

	/**
	 * @param {String} message
	 * @param {Object} metadata
	 */
	debug(message, metadata = {}) {
		winston.log('debug', message. metadata);
	};
}

module.exports = new Logger();
