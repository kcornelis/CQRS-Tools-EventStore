/// <reference path="../../typings/all.d.ts" />

import IOperation = require('./IOperation');
import uuid = require('node-uuid');
import messages = require('../messages');
import Serializer = require('../Serializer');
import TcpPacket = require('../TcpPacket');

class OperationBase implements IOperation {

	private _correlationId: string;
	private _commandCode: number;
	private _requestType: string;
	private _responseType: string;

	constructor(commandCode: number, requestType: string, responseType: string) {
		this._correlationId = uuid.v4();
		this._commandCode = commandCode;
		this._requestType = requestType;
		this._responseType = responseType;
	}

	getCorrelationId(): string {
		return this._correlationId;
	}

	getNetworkPackage(): TcpPacket {
		var serializer = new Serializer();
		var payload = new Buffer(this.getMessage() ? serializer.serialize(this._requestType, this.getMessage()) : []);

		return new TcpPacket(payload, this._commandCode, this._correlationId);
	}

	getMessage(): messages.IMessage {
		return null;
	}

	handleNetworkPackage(package: TcpPacket) {
		throw new Error('handle response not implemented');
	}

	parseMessage<T>(package: TcpPacket): T {
		var serializer = new Serializer();
		return serializer.deserialize<T>(this._responseType, package.message);
	}
}

export = OperationBase;
