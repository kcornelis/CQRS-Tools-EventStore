/// <reference path="../typings/all.d.ts" />

import should = require('should');
import Commands = require('../lib/commands');

describe('Commands', () => {

	describe('When requesting the code for a command', () => {
		it('should return the code', () => {
			Commands.commandToCode('HeartbeatRequestCommand').should.eql(1);
			Commands.commandToCode('ReadEvent').should.eql(176);
			Commands.commandToCode('BadRequest').should.eql(0xF0);
		});
	});

	describe('When requesting the command for a code', () => {
		it('should return the command name', () => {
			Commands.codeToCommand(Commands.HeartbeatRequestCommand).should.eql('HeartbeatRequestCommand');
			Commands.codeToCommand(176).should.eql('ReadEvent');
			Commands.codeToCommand(0xF0).should.eql('BadRequest');
		});
	});
});
