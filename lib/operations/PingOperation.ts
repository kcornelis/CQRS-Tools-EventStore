/// <reference path="../../typings/all.d.ts" />

import OperationBase = require('./OperationBase');
import Commands = require('../Commands');
import TcpPacket = require('../TcpPacket');
import Q = require('q');

class PingOperation extends OperationBase {

	private _deferred: Q.Deferred<void>;

	constructor() {
		super(Commands.Ping, '', ''); // no message
		this._deferred = Q.defer<void>();
	}

	getPromise(): Q.Promise<void> {
		return this._deferred.promise;
	}

	handleNetworkPackage(packet: TcpPacket) {
		this._deferred.resolve(null);
	}
}

export = PingOperation;
