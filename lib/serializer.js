/// <reference path="../typings/all.d.ts" />
var ProtoBuf = require('protobufjs');
var Serializer = (function () {
    function Serializer() {
        this._ns = 'EventStore.Client.Messages.';
        if (!this._builder) {
            ProtoBuf.convertFieldsToCamelCase = true;
            this._builder = ProtoBuf.loadProtoFile('lib/messages.proto');
        }
    }
    Serializer.prototype.serialize = function (message) {
        var protoMessage = this._builder.build(this._ns + this._getMessageName(message));
        return new protoMessage(message).toArrayBuffer();
    };
    Serializer.prototype.populate = function (message, buffer) {
        var serializer = this._builder.build(this._ns + this._getMessageName(message));
        var protoMessage = serializer.decode(buffer);
        for (var k in protoMessage) {
            if (protoMessage[k] !== undefined && typeof (protoMessage[k]) !== 'function') {
                message[k] = protoMessage[k];
            }
        }
        return message;
    };
    Serializer.prototype._getMessageName = function (m) {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((m).constructor.toString());
        return (results && results.length > 1) ? results[1] : '';
    };
    return Serializer;
})();
module.exports = Serializer;
