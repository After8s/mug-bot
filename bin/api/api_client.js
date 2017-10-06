require('dotenv').config();
const RestClient = require('node-rest-client').Client;
const EventEmitter = require('events');
const logger = require('./../logger');

class APIClient extends EventEmitter {
	/**
	 * @param {ApiOptions} [options] Options for the client
	 */
	constructor(options = {}) {
		super();

		this.logger = logger;
		this.client = new RestClient();
		this.client.debug = this.debug;

		this.serverUrl = process.env.APP_SERVER;
		this.client.on('error', function (error) {
			this.log(error);
		});
	}

	/**
	 * @param {String} methodName
	 * @param {String} resource
	 * @param {String} httpMethod
	 */
	register(methodName, resource, httpMethod) {
		this.logger.info('[' + httpMethod + '] ' + methodName + ' => ' + resource);

		this.client.registerMethod(methodName, this.serverUrl + resource, httpMethod);
	};

	/**
	 * @param {String} methodName
	 * @param {Function} callback
	 * @param {Object} args
	 */
	call(methodName, callback, args = {}) {
		let _self = this;
		if (!args) {
			args = {};
		}
		if (args.hasOwnProperty('headers')) {
			if (!args.headers.hasOwnProperty('accept')) {
				args.headers.accept = 'application/json';
			}
		} else {
			args.headers = {
				accept: 'application/json'
			};
		}
		this.logger.info('[' + methodName + ']', args);
		if (!this.client.methods.hasOwnProperty(methodName)) {
			this.logger.error('Method "' + methodName + '" does not exist!');

			return;
		}

		this.client
			.methods[methodName](args, function (data, response) {
				if (response.statusCode !== 200) {
					_self.logger.error('[API]['+response.responseUrl+'] Method "'+methodName+'" returned "' + response.statusCode + '"');

					return;
				}
				callback(data, response);
			})
			.on('error', function (error) {
				_self.logger.error('[API]' + error);
			});
	};

	/**
	 * @param {String} resource
	 * @param {Function} callback
	 * @param {String} httpMethod
	 */
	request(resource, callback, httpMethod) {
		if (!httpMethod) {
			httpMethod = 'GET';
		}
		this.client[httpMethod.toLowerCase()](this.serverUrl + resource, callback);
	};
}

// export the class
module.exports = new APIClient();
