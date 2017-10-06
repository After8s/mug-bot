const API = require('./api_client');
const BaseResource = require('./base_resource');

class Player extends BaseResource {
	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.resourcePath = '/players';
		this.api = API;
		this.api.register('player', this.resourcePath, 'GET');
		this.api.register('player_register', this.resourcePath, 'POST');

		// Register the commands
		const _self = this;
		this.registerCommand('register', function (bits, message) {
			_self.register(message.author.username);
		});
	}

	/**
	 * @param {String} username
	 */
	register(username) {
		const _self = this;

		this.player(
			username,
			function (data) {
				if (data.length) {
					_self.app.sendMessage('You are already registered!');
					return;
				}

				_self.api.call(
					'player_register',
					function (data) {
						_self.app.sendMessage('Welcome to the team! You can now join games.');
					},
					{
						data: {username: username},
						headers: {'content-type': 'application/json'}
					}
				);
			}
		);
	}

	/**
	 * @param {String} $id
	 * @param {Function} callback
	 */
	player($id, callback) {
		this.api.call(
			'player',
			callback,
			{
				parameters: {'username': $id}
			}
		)
	}
}

module.exports = new Player();
