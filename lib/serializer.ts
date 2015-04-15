/// <reference path="../typings/all.d.ts" />

import ProtoBuf = require('protobufjs');
import messages = require('./messages');
import Commands = require('./commands');

class Serializer {

	private _builder: ProtoBuf.IBuilder;
	private _ns: string = 'EventStore.Client.Messages.';

	constructor() {
		if (!this._builder) {
			ProtoBuf.convertFieldsToCamelCase = true;
			this._builder = ProtoBuf.loadProtoFile('lib/messages.proto');
		}
	}

	serialize(command: number, message: messages.IMessage) {
		var protoMessage = this._builder.build(this._ns + Commands.codeToCommand(command));
		return new protoMessage(message).toBuffer();
	}

	deserialize<T extends messages.IMessage>(command: number, buffer: any): T {
		var serializer = this._builder.build(this._ns + Commands.codeToCommand(command));
		return <T>serializer.decode(buffer);
	}
}

export = Serializer;
