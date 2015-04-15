/// <reference path="../typings/all.d.ts" />
require('should');
var Commands = require('../lib/commands');
describe('Commands', function () {
    describe('When requesting the code for a command', function () {
        it('should return the code', function () {
            Commands.commandToCode('HeartbeatRequestCommand').should.eql(1);
            Commands.commandToCode('ReadEvent').should.eql(176);
            Commands.commandToCode('BadRequest').should.eql(0xF0);
        });
    });
    describe('When requesting the command for a code', function () {
        it('should return the command name', function () {
            Commands.codeToCommand(Commands.HeartbeatRequestCommand).should.eql('HeartbeatRequestCommand');
            Commands.codeToCommand(176).should.eql('ReadEvent');
            Commands.codeToCommand(0xF0).should.eql('BadRequest');
        });
    });
});
