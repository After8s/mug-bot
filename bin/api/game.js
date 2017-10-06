const BaseResource = require('./base_resource');
const API = require('./api_client');
const chrono = require('chrono-node');

// TODO: This is still not used / needs to be adapted to the new BaseResource format
class Game extends BaseResource {
	/**
	 * Constructor
	 *
	 * @param {Client} discordClient
	 */
	constructor(discordClient) {
		super(discordClient);

		this.resourcePath = '/games';
		this.api = API;
		this.api.register('list_games', this.resourcePath, 'GET');
		this.api.register('create_game', this.resourcePath, 'POST');
		this.api.register('delete_game', this.resourcePath + '/${id}', 'DELETE');
	};

	/**
	 * List all games
	 */
	games() {
		const _self = this;

		this.api.call(
			'list_games',
			function (data) {
				if (!data.length) {
					_self.sendMessage('No games found. Create one');

					return;
				}

				data.forEach(function (game, idx) {
					_self.sendMessage((idx + 1) + '. ' + game.name);
				});
			}
		);
	};

	/**
	 * Creates a game
	 *
	 * @param {String} gameType
	 * @param {Date} date
	 * @param {Array} members
	 */
	create(gameType, date, members) {
		const _self = this;

		if (!gameType || !date || !time) {
			_self.sendMessage('Wrong format, e.g.: !create raid this friday @the_jedd_boot @unperfecthuman @ArticFapper');
		}

		let args = {
			data: {
				gameMode: '/game_modes/'+gameType,
				createdAt: '/'
			}
		};
	};

	handleMessage(message) {
		this.logger.info('Handling message', {message: message.content});
		let bits = message.content.split(' ');
		let command = bits.shift();

		switch (command) {
			case '!games':
				this.games();

				break;
			case '!create':
				let gameType = bits.shift();
				let dateTime = chrono.parse(message.content);
				let members = [];
				for (let i in bits) {
					if (0 === bits[i].indexOf('@')) {
						members.push(bits[i]);
					}
				}

				this.create(gameType, dateTime, members);

				break;
		}
	};
}

module.exports = new Game();
