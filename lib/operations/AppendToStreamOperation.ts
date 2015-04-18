/// <reference path="../../typings/all.d.ts" />

import OperationBase = require('./OperationBase');
import Commands = require('../Commands');
import TcpPacket = require('../TcpPacket');
import messages = require('../messages');
import results = require('../results');
import Q = require('q');

class AppendToStreamOperation extends OperationBase {

	private _deferred: Q.Deferred<messages.WriteEventsCompleted>;
	private _stream: string;
	private _expectedVersion: number;
	private _events: messages.NewEvent[];

	constructor(stream: string, expectedVersion: number, events: messages.NewEvent[]) {
		super(Commands.WriteEvents, 'WriteEvents', 'WriteEventsCompleted');

		this._deferred = Q.defer<messages.WriteEventsCompleted>();
		this._stream = stream;
		this._expectedVersion = expectedVersion;
		this._events = events;
	}

	getMessage(): messages.IMessage {
		return new messages.WriteEvents(this._stream, this._expectedVersion, this._events);
	}

	getPromise(): Q.Promise<messages.WriteEventsCompleted> {
		return this._deferred.promise;
	}

	handleNetworkPackage(packet: TcpPacket) {
		var response = this.parseMessage<messages.WriteEventsCompleted>(packet);

		if (response.result === results.OperationResult.success) {
			this._deferred.resolve(response);
		} else {
			this._deferred.reject(response);
		}
	}
}

export = AppendToStreamOperation;
