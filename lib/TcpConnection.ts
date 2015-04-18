/// <reference path="../typings/all.d.ts" />

/* tslint:disable:no-empty */

import net = require('net');
import Commands = require('./Commands');
import TcpPacket = require('./TcpPacket');
import IConnection = require('./IConnection');
import messages = require('../lib/messages');
import operations = require('./operations');
import Settings = require('./Settings');
import log = require('./Logger');
import Q = require('q');

class ConnectionSettings {
	port: number;
	host: string;
}

class TcpConnection implements IConnection {

	private _socket: net.Socket;
	private _settings: ConnectionSettings = new ConnectionSettings();
	private _buffer: Buffer = null;
	private _runningOperations: any = { };
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

	ping() : Q.Promise<void> {
		log.debug('TcpConnection - ping', 'Sending ping');

		var operation = new operations.PingOperation();
		this._sendOperation(operation);
		return operation.getPromise();
	}

	appendToStream(stream: string, expectedVersion: number, event: messages.NewEvent): Q.Promise<messages.WriteEventsCompleted>;
	appendToStream(stream: string, expectedVersion: number, events: messages.NewEvent[]): Q.Promise<messages.WriteEventsCompleted>;
	appendToStream(stream: string, expectedVersion: number, events: any): Q.Promise<messages.WriteEventsCompleted> {
		log.debug('TcpConnection - appendToStream', 'Append data to stream ' + stream + ', expected version ' + expectedVersion);

		var eventArray: messages.NewEvent[];
		if (Object.prototype.toString.call(events) === '[object Array]' ) {
			eventArray = events;
		} else {
			eventArray = [ events ];
		}

		var operation = new operations.AppendToStreamOperation(stream, expectedVersion, eventArray);
		this._sendOperation(operation);
		return operation.getPromise();
	}

	deleteStream(stream: string, expectedVersion: number, hardDelete: boolean = false): Q.Promise<messages.DeleteStreamCompleted> {
		log.debug('TcpConnection - deleteStream', 'Delete stream ' + stream + ', expected version ' + expectedVersion);

		var operation = new operations.DeleteStreamOperation(stream, expectedVersion, hardDelete, Settings.requireMaster);
		this._sendOperation(operation);
		return operation.getPromise();
	}

	readStreamEventsForward(stream: string, from: number, max: number): Q.Promise<messages.ReadStreamEventsCompleted> {
		log.debug('TcpConnection - readStreamEventsForward', 'Read stream ' + stream + ', from ' + from + ', max ' + max);

		var operation = new operations.ReadStreamForwardOperation(stream, from, max);
		this._sendOperation(operation);
		return operation.getPromise();
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

	private _handleData(data: Buffer) {

		// we already have data in our buffer
		// merge the buffer and the data and proceed
		if (this._buffer) {
			var merged = new Buffer(this._buffer.length + data.length);
			this._buffer.copy(merged, 0);
			data.copy(merged, this._buffer.length);
			data = merged;
			this._buffer = null;
		}

		var packet = new TcpPacket(data);

		if (packet.isIncomplete) {
			log.debug('TcpConnection - _handleData', 'Received a packet that is to small, keep it and wait for the next packet');

			this._buffer = data;
		} else if (packet.isToLarge) {
			log.debug('TcpConnection - _handleData', 'Received a packet that is to big, split it it and retry');

			this._handleData(data.slice(0, packet.expectedPacketLength));
			this._handleData(data.slice(packet.expectedPacketLength));
		} else {
			this._processCompletePacket(packet);
		}
	}

	private _processCompletePacket(packet: TcpPacket) {

		var operation = this._runningOperations[packet.correlationId];

		if (operation) {
			log.debug('TcpConnection - _processCompletePacket', 'Operation found for command ' + Commands.codeToCommand(packet.commandCode) + ' - ' + operation.getCorrelationId());

			delete this._runningOperations[packet.correlationId];
			operation.handleNetworkPackage(packet);
		} else if (packet.commandCode === Commands.HeartbeatRequestCommand) {
			this._sendOperation(new operations.HeartbeatOperation());
		} else if (packet.commandCode === Commands.HeartbeatResponseCommand) {
		} else {

			log.warn('TcpConnection - _processCompletePacket', 'No operation found for ' + Commands.codeToCommand(packet.commandCode) + ' with correlation id ' + packet.correlationId);
		}
	}

	private _sendOperation(operation: operations.IOperation) {

		this._runningOperations[operation.getCorrelationId()] = operation;
		this._socket.write(operation.getNetworkPackage().data);
	}
}

export = TcpConnection;
