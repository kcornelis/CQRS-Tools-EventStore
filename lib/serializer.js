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
    Serializer.prototype.serialize = function (type, message) {
        var protoMessage = this._builder.build(this._ns + type);
        return new protoMessage(message).toBuffer();
    };
    Serializer.prototype.deserialize = function (type, buffer) {
        var serializer = this._builder.build(this._ns + type);
        return serializer.decode(buffer);
    };
    return Serializer;
})();
module.exports = Serializer;
