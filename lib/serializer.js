/// <reference path="../typings/all.d.ts" />
var ProtoBuf = require('protobufjs');
var Commands = require('./commands');
var Serializer = (function () {
    function Serializer() {
        this._ns = 'EventStore.Client.Messages.';
        if (!this._builder) {
            ProtoBuf.convertFieldsToCamelCase = true;
            this._builder = ProtoBuf.loadProtoFile('lib/messages.proto');
        }
    }
    Serializer.prototype.serialize = function (command, message) {
        var protoMessage = this._builder.build(this._ns + Commands.codeToCommand(command));
        return new protoMessage(message).toBuffer();
    };
    Serializer.prototype.deserialize = function (command, buffer) {
        var serializer = this._builder.build(this._ns + Commands.codeToCommand(command));
        return serializer.decode(buffer);
    };
    return Serializer;
})();
module.exports = Serializer;
