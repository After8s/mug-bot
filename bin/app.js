require('dotenv').config();
const Discord = require("discord.js");
const logger = require('./logger');

class App {
	/**
	 * Constructor
	 */
	constructor() {
		const _self = this;
		this.defaultChannel = null;

		// Discord client and events
		this.discordClient = new Discord.Client();
		this.discordClient.on('ready', () => {
			logger.info(`Logged in as ${_self.discordClient.user.tag}!`);
			_self.discordClient
				.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE', 'MANAGE_CHANNELS'])
				.then(link => {
					logger.info(`Generated bot invite link: ${link}`);
				});

			_self.init();
		});

		// Api resources
		this.apiResources = [];

		this.discordClient.login(process.env.APP_TOKEN);
	}

	/**
	 * Runs when the discord bot is ready
	 */
	init() {
		const _self = this;

		// Register resources after app is built and ready
		this.apiResources.push(require('./api/game_mode'));
		this.apiResources.push(require('./api/player'));

		// Create a listener for the discord messages and for each resource listen
		this.discordClient.on('message', function (message) {
			_self.apiResources.forEach(function (resource) {
				resource.handleMessage(message);
			})
		});

		// Default channel
		this.discordClient.guilds.first().channels.forEach(function (channel) {
			if (channel.name === process.env.APP_DEFAULT_CHANNEL) {
				_self.defaultChannel = channel;
			}
		});
		if (!this.defaultChannel) {
			let channels = [];
			this.discordClient.guilds.first().channels.forEach(function (channel) {
				channels.push(channel.name);
			});

			throw new Error('The channel "' + process.env.APP_DEFAULT_CHANNEL + '" does not exist. Available channels are: ' + channels.join(', '));
		}
	}

	/**
	 * Send a message to the default channel
	 *
	 * @param {String} message
	 */
	sendMessage(message) {
		this.defaultChannel.send(message);
	};
}

module.exports = new App();
