/// <reference path="../typings/all.d.ts" />

import ProtoBuf = require('protobufjs');
import messages = require('messages');

class Serializer {

	private _builder: ProtoBuf.IBuilder;
	private _ns: string = 'EventStore.Client.Messages.';

	constructor() {
		if (!this._builder) {
			ProtoBuf.convertFieldsToCamelCase = true;
			this._builder = ProtoBuf.loadProtoFile('lib/messages.proto');
		}
	}

	serialize(message: messages.IMessage) {
		var protoMessage = this._builder.build(this._ns + this._getMessageName(message));
		return new protoMessage(message).toArrayBuffer();
	}

	populate<T extends messages.IMessage>(message: T, buffer: any): T {
		var serializer = this._builder.build(this._ns + this._getMessageName(message));
		var protoMessage = serializer.decode(buffer);
		for (var k in protoMessage) {
			if (protoMessage[k] !== undefined && typeof(protoMessage[k]) !== 'function') {
				message[k] = protoMessage[k];
			}
		}
		return message;
	}

	private _getMessageName(m) {
		var funcNameRegex = /function (.{1,})\(/;
		var results = (funcNameRegex).exec((m).constructor.toString());
		return (results && results.length > 1) ? results[1] : '';
	}
}

export = Serializer;
