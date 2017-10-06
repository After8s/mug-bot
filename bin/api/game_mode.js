const BaseResource = require('./base_resource');
const API = require('./api_client');

class GameMode extends BaseResource {
	/**
	 * Constructor
	 *
	 * @param {App} app
	 */
	constructor() {
		super();

		this.resourcePath = '/game_modes';
		this.api = API;
		this.api.register('list_game_modes', this.resourcePath, 'GET');
		this.api.register('get_game_mode', this.resourcePath + '/$id', 'GET');

		// Register commands
		const _self = this;
		this.registerCommand(['modes', 'gameModes'], function (bits, message) {
			_self.modes();
		});
	}

	/**
	 * Return the game modes
	 */
	modes() {
		let _self = this;

		this.api.call(
			'list_game_modes',
			function (data) {
				data.forEach(function (mode, idx) {
					_self.app.sendMessage((idx + 1) + '. ' + mode.name);
				});
			}
		);
	};

	/**
	 * Looks for a mode
	 *
	 * TODO: this is not being used, also modes should be searchable ?
	 *
	 * @param {String} $id
	 * @param {Function} callback
	 */
	mode($id, callback) {
		this.api.call(
			'get_game_mode',
			callback,
			{
				path: {'id': $id}
			}
		)
	}

}

module.exports = new GameMode();
