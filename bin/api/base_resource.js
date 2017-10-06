require('dotenv').config();
const logger = require('./../logger');

function BaseResource() {
	this.logger = logger;
	this.app = require('./../app');
	this.commands = [];
	this.commandSymbol = process.env.APP_COMMAND_SYMBOL;
}

/**
 * Register a command
 *
 * @param {Array|String} commands
 * @param {Function} callback
 */
BaseResource.prototype.registerCommand = function (commands, callback) {
	if (!Array.isArray(commands)) {
		commands = [commands];
	}

	let _self = this;
	commands.forEach(function (command) {
		let fullCommandName = _self.commandSymbol + command;
		_self.commands.push({name: fullCommandName, callback: callback});
	});
};

/**
 * Listener that handles discord message
 *
 * @param {Message} message
 */
BaseResource.prototype.handleMessage = function(message) {
	let bits = message.content.split(' ');
	let messageCommandName = bits.shift();

	// show all commands for the resource
	const _self = this;
	if (messageCommandName === this.commandSymbol + 'commands') {
		this.commands.forEach(function (command) {
			_self.sendMessage(_self.commandSymbol + command.name);
		});

		return;
	}

	// Check if the commands defined matches the command issued
	this.commands.forEach(function (command) {
		if (command.name === messageCommandName) {
			command.callback(bits, message);
		}
	});
};

module.exports = BaseResource;
