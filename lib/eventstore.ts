/// <reference path="../typings/all.d.ts" />

/* tslint:disable:no-empty */

import net = require('net');
import uuid = require('node-uuid');
import Commands = require('./commands');
import IConnection = require('./iconnection');
import messages = require('./messages');
import Serializer = require('./serializer');
import common = require('./common');
import log = require('./logger');

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

class ResponseInfo {
	constructor(callback: (error?: any, result?: any) => void, keepAlive: boolean) {
		this.callback = callback || function() { };
		this.keepAlive = keepAlive;
	}
	keepAlive: boolean = false;
	callback: (error?: any, result?: any) => void;
}

class Settings {
	port: number;
	host: string;
}

class TcpConnection implements IConnection {

	private _socket: net.Socket;
	private _settings: Settings = new Settings();
	private _serializer: Serializer = new Serializer();
	private _buffer: Buffer = null;
	private _responseInfos : any = { };
	private _onConnect: () => void;
	private _onEnd: () => void;
	private _onClose: (hadError: boolean) => void;
	private _onError: (error: any) => void;

	constructor(settings: any = { }) {
		log.info('TcpConnection - constructor', 'Created a tcp connection');

		this._settings.port = settings.port || 1113;
		this._settings.host = settings.host || '127.0.0.1';
	}

	connect() {
		log.info('TcpConnection - connect', 'Connecting to ' + this._settings.host + ':' + this._settings.port);

		this._socket = net.createConnection(this._settings.port, this._settings.host);
		this._socket.on('connect', () => { this._handleConnect(); });
		this._socket.on('data', (data) => { this._handleData(data); });
		this._socket.on('error', (error) => { this._handleError(error); });
		this._socket.on('end', () => { this._handleEnd(); });
		this._socket.on('close', (hadError) => { this._handleClose(hadError); });
	}

	onConnect(callback: () => void) {
		this._onConnect = callback;
	}

	onError(callback: (error) => void) {
		this._onError = callback;
	}

	onEnd(callback: () => void) {
		this._onEnd = callback;
	}

	ping(callback: (error?: any) => void) {
		log.debug('TcpConnection - ping', 'Sending ping');

		this._sendTcpPacket(Commands.Ping, null, callback);
	}

	appendToStream(stream: string, expectedVersion: number, event: messages.NewEvent, callback: (error?: any, result?: messages.WriteEventsCompleted) => void);
	appendToStream(stream: string, expectedVersion: number, events: messages.NewEvent[], callback: (error?: any, result?: messages.WriteEventsCompleted) => void);
	appendToStream(stream: string, expectedVersion: number, events: any, callback: (error?: any, result?: messages.WriteEventsCompleted) => void) {
		log.debug('TcpConnection - appendToStream', 'Append data to stream ' + stream + ', expected version ' + expectedVersion);

		var eventArray: messages.NewEvent[];
		if (Object.prototype.toString.call(events) === '[object Array]' ) {
			eventArray = events;
		} else {
			eventArray = [ events ];
		}

		this._sendTcpPacket(Commands.WriteEvents, this._serializer.serialize(Commands.WriteEvents, new messages.WriteEvents(stream, expectedVersion, events)), callback);
	}

	private _handleWriteEventsCompleted(correlationId: string, payload: Buffer) {
		log.debug('TcpConnection - _handleWriteEventsCompleted', 'Received write events completed', { commandCode: Commands.DeleteStreamCompleted, correlationId: correlationId, message: message });

		var callback = this._getResponseCallback(correlationId);
		var message = this._serializer.deserialize<messages.WriteEventsCompleted>(Commands.WriteEventsCompleted, payload);

		if (!callback) {
			log.debug('TcpConnection - _handleWriteEventsCompleted', 'No callback registered', { commandCode: Commands.WriteEventsCompleted, correlationId: correlationId, noCallback: true });
		} else if (message.result === messages.OperationResult.success) {
			callback(null, message);
		} else {
			callback('Operation result: ' + message.result, message);
		}
	}

	deleteStream(stream: string, expectedVersion: number, callback: (error?: any, result?: messages.DeleteStreamCompleted) => void) {
		log.debug('TcpConnection - deleteStream', 'Delete stream ' + stream + ', expected version ' + expectedVersion);

		this._sendTcpPacket(Commands.DeleteStream, this._serializer.serialize(Commands.DeleteStream, new messages.DeleteStream(stream, expectedVersion)), callback);
	}

	private _handleDeleteStreamCompleted(correlationId: string, payload: Buffer) {
		log.debug('TcpConnection - _handleDeleteStreamCompleted', 'Received delete stream completed', { commandCode: Commands.DeleteStreamCompleted, correlationId: correlationId, message: message });

		var callback = this._getResponseCallback(correlationId);
		var message = this._serializer.deserialize<messages.DeleteStreamCompleted>(Commands.DeleteStreamCompleted, payload);

		if (!callback) {
			log.debug('TcpConnection - _handleDeleteStreamCompleted', 'No callback registered', { commandCode: Commands.DeleteStreamCompleted, correlationId: correlationId, noCallback: true });
		} else if (message.result === messages.OperationResult.success) {
			callback(null, message);
		} else {
			callback('Operation result: ' + message.result, message);
		}
	}

	private _handleConnect() {
		log.info('TcpConnection - _handleConnect', 'Connected to the eventstore');

		if (this._onConnect) {
			this._onConnect();
		}
	}

	private _handleEnd() {
		log.info('TcpConnection - _handleEnd', 'Connection received a FIN packet, closing the socket');

		if (this._onEnd) {
			this._onEnd();
		}
	}

	private _handleClose(hadError) {
		log.info('TcpConnection - _handleClose', 'Connection closed (had error:' + hadError + ')');

		if (this._onClose) {
			this._onClose(hadError);
		}
	}

	private _handleError(error) {
		log.error('TcpConnection - _handleError', 'Received an error (' + error + ')', { code: error.code });

		if (this._onError) {
			this._onError(error);
		}
	}

	private _handleData(packet: Buffer) {

		// we already have data in our buffer
		// merge the buffer and the packet and proceed
		if (this._buffer) {
			var newPacket = new Buffer(this._buffer.length + packet.length);
			this._buffer.copy(newPacket, 0);
			packet.copy(newPacket, this._buffer.length);
			packet = newPacket;
			this._buffer = null;
		}

		// packet is to small
		if (packet.length <= TcpHeaderPart.contentLength) {
			this._buffer = packet;
			return;
		}

		var contentLength = packet.readUInt32LE(TcpPacketOffset.contentLength);
		var expectedPacketLength = contentLength + TcpHeaderPart.contentLength;

		if (packet.length === expectedPacketLength) {
			// we received the complete packet
			// remove the content length header and process the packet
			this._processCompletePacket(packet);
		} else if (packet.length >= expectedPacketLength) {
			log.debug('TcpConnection - _handleData', 'Received a packet that is to big, split it it and retry');

			this._handleData(packet.slice(0, expectedPacketLength));
			this._handleData(packet.slice(expectedPacketLength));
		} else {
			log.debug('TcpConnection - _handleData', 'Received a packet that is to small, keep it and wait for the next packet');

			this._buffer = packet;
		}
	}

	private _processCompletePacket(packet: Buffer) {

		var commandCode = packet.readUInt8(TcpPacketOffset.command);
		var command = Commands.codeToCommand(commandCode);
		var correlationId = uuid.unparse(packet, TcpPacketOffset.correlationId);

		var payload = null;
		if (packet.length > TcpHeaderPart.full) {
			payload = packet.slice(TcpHeaderPart.full);
		}

		if (commandCode === Commands.WriteEventsCompleted) {
			this._handleWriteEventsCompleted(correlationId, payload);
		} else if (commandCode === Commands.DeleteStreamCompleted) {
			this._handleDeleteStreamCompleted(correlationId, payload);
		} else {
			log.warn('TcpConnection - _processCompletePacket', 'Received unknown packet type (' + command + ')', { commandCode: commandCode, correlationId: correlationId, unknownCommand: true });

			var callback = this._getResponseCallback(correlationId);
			if (callback) { callback(); }
		}
	}

	private _getResponseCallback(correlationId: string) {
		var responseInfo = this._responseInfos[correlationId];
		if (responseInfo) {
			if (!responseInfo.keepAlive) {
				delete this._responseInfos[correlationId];
			}
			return responseInfo.callback;
		} else {
			return function() {};
		}
	}

	private _sendTcpPacket(commandId: number, payload: any, cb: (error?: any, result?: any) => void) {

		var correlationId = uuid.v4();
		var responseInfo = new ResponseInfo(cb, false);
		this._responseInfos[correlationId] = responseInfo;

		var packet = this._createTcpPacket(commandId, correlationId, payload);
		this._socket.write(packet);
	}

	private _createTcpPacket(commandId: number, correlationId: string, payload: any) {

		payload = new Buffer(payload || []);
		var flags = 0;
		var payloadSize = payload ? payload.length : 0;
		var fullPacketSize = TcpHeaderPart.full + payloadSize;
		var packetContentLength = fullPacketSize - TcpHeaderPart.contentLength;

		var packet = new Buffer(fullPacketSize);
		packet.writeUInt32LE(packetContentLength, TcpPacketOffset.contentLength);
		packet.writeUInt8(commandId, TcpPacketOffset.command);
		packet.writeUInt8(flags, TcpPacketOffset.flags);
		uuid.parse(correlationId, packet, TcpPacketOffset.correlationId);
		if (payloadSize > 0) {
			payload.copy(packet, TcpPacketOffset.payload);
		}

		return packet;
	}
}

class EventStore {
	static createConnection(): IConnection {
		return new TcpConnection();
	}
}

export = EventStore;
