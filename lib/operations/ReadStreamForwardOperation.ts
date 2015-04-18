/// <reference path="../../typings/all.d.ts" />

import OperationBase = require('./OperationBase');
import Commands = require('../Commands');
import TcpPacket = require('../TcpPacket');
import messages = require('../messages');
import results = require('../results');
import Q = require('q');

class ReadStreamForwardOperation extends OperationBase {

	private _deferred: Q.Deferred<messages.ReadStreamEventsCompleted>;
	private _stream: string;
	private _from: number;
	private _max: number;

	constructor(stream: string, from: number, max: number) {
		super(Commands.ReadStreamEventsForward, 'ReadStreamEvents', 'ReadStreamEventsCompleted');

		this._deferred = Q.defer<messages.ReadStreamEventsCompleted>();
		this._stream = stream;
		this._from = from;
		this._max = max;
	}

	getMessage(): messages.IMessage {
		return new messages.ReadStreamEvents(this._stream, this._from, this._max);
	}

	getPromise(): Q.Promise<messages.ReadStreamEventsCompleted> {
		return this._deferred.promise;
	}

	handleNetworkPackage(packet: TcpPacket) {

		var response = this.parseMessage<messages.ReadStreamEventsCompleted>(packet);

		if (response.result === results.ReadStreamResult.success) {
			this._deferred.resolve(response);
		} else {
			this._deferred.reject(response);
		}
	}
}

export = ReadStreamForwardOperation;
