/// <reference path="../typings/all.d.ts" />

import uuid = require('node-uuid');

class TcpHeaderPart {
	static contentLength: number = 4;
	static command: number = 1;
	static flags: number = 1;
	static correlationId: number = 16;
	static full: number = TcpHeaderPart.contentLength + TcpHeaderPart.command + TcpHeaderPart.flags + TcpHeaderPart.correlationId;
}

class TcpPacketOffset {
	static contentLength: number = 0;
	static command: number = TcpHeaderPart.contentLength;
	static flags: number = TcpHeaderPart.contentLength + TcpHeaderPart.command;
	static correlationId: number = TcpHeaderPart.contentLength + TcpHeaderPart.command + TcpHeaderPart.flags;
	static payload: number = TcpHeaderPart.contentLength + TcpHeaderPart.command + TcpHeaderPart.flags + TcpHeaderPart.correlationId;
}

class TcpPacket {

	private _data: Buffer;

	constructor(data: Buffer)
	constructor(payload: Buffer, commandCode: number, correlationId: string)
	constructor(data: Buffer, commandCode?: number, correlationId?: string) {
		if (!commandCode) {
			this._data = data;
		} else {

			var flags = 0;
			var payloadSize = data ? data.length : 0;
			var fullPacketSize = TcpHeaderPart.full + payloadSize;
			var packetContentLength = fullPacketSize - TcpHeaderPart.contentLength;

			var packet = new Buffer(fullPacketSize);
			packet.writeUInt32LE(packetContentLength, TcpPacketOffset.contentLength);
			packet.writeUInt8(commandCode, TcpPacketOffset.command);
			packet.writeUInt8(flags, TcpPacketOffset.flags);
			uuid.parse(correlationId, packet, TcpPacketOffset.correlationId);
			if (payloadSize > 0) {
				data.copy(packet, TcpPacketOffset.payload);
			}

			this._data = packet;
		}
	}

	get data(): Buffer {
		return this._data;
	}

	get expectedPacketLength(): number {
		if (this._data.length <= TcpHeaderPart.contentLength) {
			return -1;
		}

		var contentLength = this._data.readUInt32LE(TcpPacketOffset.contentLength);
		return contentLength + TcpHeaderPart.contentLength;
	}

	get isIncomplete(): boolean {
		if (this._data.length <= TcpHeaderPart.contentLength) {
			return true;
		}

		return this._data.length < this.expectedPacketLength;
	}

	get isToLarge(): boolean {
		return this._data.length > this.expectedPacketLength;
	}

	get commandCode(): number {
		return this._data.readUInt8(TcpPacketOffset.command);
	}

	get correlationId(): string {
		return uuid.unparse(this._data, TcpPacketOffset.correlationId);
	}

	get message(): Buffer {
		if (this._data.length > TcpHeaderPart.full) {
			// remove the header
			return this._data.slice(TcpHeaderPart.full);
		}
		return null;
	}
}

export = TcpPacket;
