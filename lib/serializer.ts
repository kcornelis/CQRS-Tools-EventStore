/// <reference path="../typings/all.d.ts" />

import ProtoBuf = require('protobufjs');
import messages = require('./messages');
import Commands = require('./Commands');

class Serializer {

	private _builder: ProtoBuf.IBuilder;
	private _ns: string = 'EventStore.Client.Messages.';

	constructor() {
		if (!this._builder) {
			ProtoBuf.convertFieldsToCamelCase = true;
			this._builder = ProtoBuf.loadProtoFile('lib/messages.proto');
		}
	}

	serialize(type: string, message: messages.IMessage) {
		var protoMessage = this._builder.build(this._ns + type);
		return new protoMessage(message).toBuffer();
	}

	deserialize<T extends messages.IMessage>(type: string, buffer: Buffer): T {
		var serializer = this._builder.build(this._ns + type);
		return <T>serializer.decode(buffer);
	}
}

export = Serializer;
