/// <reference path="../../typings/all.d.ts" />

import OperationBase = require('./OperationBase');
import Commands = require('../Commands');
import TcpPacket = require('../TcpPacket');
import messages = require('../messages');
import results = require('../results');
import Q = require('q');

class DeleteStreamOperation extends OperationBase {

	private _deferred: Q.Deferred<messages.DeleteStreamCompleted>;
	private _stream: string;
	private _expectedVersion: number;
	private _requireMaster: boolean;
	private _hardDelete: boolean;

	constructor(stream: string, expectedVersion: number, hardDelete: boolean, requireMaster: boolean) {
		super(Commands.DeleteStream, 'DeleteStream', 'DeleteStreamCompleted');

		this._deferred = Q.defer<messages.DeleteStreamCompleted>();
		this._stream = stream;
		this._expectedVersion = expectedVersion;
		this._requireMaster = requireMaster;
		this._hardDelete = hardDelete;
	}

	getMessage(): messages.IMessage {
		return new messages.DeleteStream(this._stream, this._expectedVersion, this._requireMaster, this._hardDelete);
	}

	getPromise(): Q.Promise<messages.DeleteStreamCompleted> {
		return this._deferred.promise;
	}

	handleNetworkPackage(packet: TcpPacket) {
		var response = this.parseMessage<messages.DeleteStreamCompleted>(packet);

		if (response.result === results.OperationResult.success) {
			this._deferred.resolve(response);
		} else {
			this._deferred.reject(response);
		}
	}
}

export = DeleteStreamOperation;
