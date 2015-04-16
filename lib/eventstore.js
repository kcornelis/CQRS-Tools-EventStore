/// <reference path="../typings/all.d.ts" />
/* tslint:disable:no-empty */
var net = require('net');
var uuid = require('node-uuid');
var Commands = require('./commands');
var messages = require('./messages');
var Serializer = require('./serializer');
var log = require('./logger');
var TcpHeaderPart = (function () {
    function TcpHeaderPart() {
    }
    TcpHeaderPart.contentLength = 4;
    TcpHeaderPart.command = 1;
    TcpHeaderPart.flags = 1;
    TcpHeaderPart.correlationId = 16;
    TcpHeaderPart.full = TcpHeaderPart.contentLength + TcpHeaderPart.command + TcpHeaderPart.flags + TcpHeaderPart.correlationId;
    return TcpHeaderPart;
})();
var TcpPacketOffset = (function () {
    function TcpPacketOffset() {
    }
    TcpPacketOffset.contentLength = 0;
    TcpPacketOffset.command = TcpHeaderPart.contentLength;
    TcpPacketOffset.flags = TcpHeaderPart.contentLength + TcpHeaderPart.command;
    TcpPacketOffset.correlationId = TcpHeaderPart.contentLength + TcpHeaderPart.command + TcpHeaderPart.flags;
    TcpPacketOffset.payload = TcpHeaderPart.contentLength + TcpHeaderPart.command + TcpHeaderPart.flags + TcpHeaderPart.correlationId;
    return TcpPacketOffset;
})();
var ResponseInfo = (function () {
    function ResponseInfo(callback, keepAlive) {
        this.keepAlive = false;
        this.callback = callback || function () {
        };
        this.keepAlive = keepAlive;
    }
    return ResponseInfo;
})();
var Settings = (function () {
    function Settings() {
    }
    return Settings;
})();
var TcpConnection = (function () {
    function TcpConnection(settings) {
        if (settings === void 0) { settings = {}; }
        this._settings = new Settings();
        this._serializer = new Serializer();
        this._buffer = null;
        this._responseInfos = {};
        log.info('TcpConnection - constructor', 'Created a tcp connection');
        this._settings.port = settings.port || 1113;
        this._settings.host = settings.host || '127.0.0.1';
    }
    TcpConnection.prototype.connect = function () {
        var _this = this;
        log.info('TcpConnection - connect', 'Connecting to ' + this._settings.host + ':' + this._settings.port);
        this._socket = net.createConnection(this._settings.port, this._settings.host);
        this._socket.on('connect', function () {
            _this._handleConnect();
        });
        this._socket.on('data', function (data) {
            _this._handleData(data);
        });
        this._socket.on('error', function (error) {
            _this._handleError(error);
        });
        this._socket.on('end', function () {
            _this._handleEnd();
        });
        this._socket.on('close', function (hadError) {
            _this._handleClose(hadError);
        });
    };
    TcpConnection.prototype.onConnect = function (callback) {
        this._onConnect = callback;
    };
    TcpConnection.prototype.onError = function (callback) {
        this._onError = callback;
    };
    TcpConnection.prototype.onEnd = function (callback) {
        this._onEnd = callback;
    };
    TcpConnection.prototype.ping = function (callback) {
        log.debug('TcpConnection - ping', 'Sending ping');
        this._sendTcpPacket(Commands.Ping, null, callback);
    };
    TcpConnection.prototype.appendToStream = function (stream, expectedVersion, events, callback) {
        var eventArray;
        if (Object.prototype.toString.call(events) === '[object Array]') {
            eventArray = events;
        }
        else {
            eventArray = [events];
        }
        this.appendToStreamRaw(new messages.WriteEvents(stream, expectedVersion, events), callback);
    };
    TcpConnection.prototype.appendToStreamRaw = function (message, callback) {
        log.debug('TcpConnection - appendToStreamRaw', 'Append data to stream ' + message.eventStreamId + ', expected version ' + message.expectedVersion);
        this._sendTcpPacket(Commands.WriteEvents, this._serializer.serialize('WriteEvents', message), callback);
    };
    TcpConnection.prototype._handleWriteEventsCompleted = function (correlationId, payload) {
        log.debug('TcpConnection - _handleWriteEventsCompleted', 'Received write events completed', { commandCode: Commands.DeleteStreamCompleted, correlationId: correlationId, message: message });
        var callback = this._getResponseCallback(correlationId);
        var message = this._serializer.deserialize('WriteEventsCompleted', payload);
        if (!callback) {
            log.debug('TcpConnection - _handleWriteEventsCompleted', 'No callback registered', { commandCode: Commands.WriteEventsCompleted, correlationId: correlationId, noCallback: true });
        }
        else if (message.result === messages.OperationResult.success) {
            callback(null, message);
        }
        else {
            callback('Operation result: ' + message.result, message);
        }
    };
    TcpConnection.prototype.deleteStream = function (stream, expectedVersion, callback) {
        this.deleteStreamRaw(new messages.DeleteStream(stream, expectedVersion), callback);
    };
    TcpConnection.prototype.deleteStreamRaw = function (message, callback) {
        log.debug('TcpConnection - deleteStreamRaw', 'Delete stream ' + message.eventStreamId + ', expected version ' + message.expectedVersion);
        this._sendTcpPacket(Commands.DeleteStream, this._serializer.serialize('DeleteStream', message), callback);
    };
    TcpConnection.prototype._handleDeleteStreamCompleted = function (correlationId, payload) {
        log.debug('TcpConnection - _handleDeleteStreamCompleted', 'Received delete stream completed', { commandCode: Commands.DeleteStreamCompleted, correlationId: correlationId, message: message });
        var callback = this._getResponseCallback(correlationId);
        var message = this._serializer.deserialize('DeleteStreamCompleted', payload);
        if (!callback) {
            log.debug('TcpConnection - _handleDeleteStreamCompleted', 'No callback registered', { commandCode: Commands.DeleteStreamCompleted, correlationId: correlationId, noCallback: true });
        }
        else if (message.result === messages.OperationResult.success) {
            callback(null, message);
        }
        else {
            callback('Operation result: ' + message.result, message);
        }
    };
    TcpConnection.prototype.readStreamEventsForward = function (stream, from, max, callback) {
        this.readStreamEventsForwardRaw(new messages.ReadStreamEvents(stream, from, max), callback);
    };
    TcpConnection.prototype.readStreamEventsForwardRaw = function (message, callback) {
        log.debug('TcpConnection - readStreamEventsForwardRaw', 'Reading stream ' + message.eventStreamId + ', start: ' + message.fromEventNumber + ', max: ' + message.maxCount);
        this._sendTcpPacket(Commands.ReadStreamEventsForward, this._serializer.serialize('ReadStreamEvents', message), callback);
    };
    TcpConnection.prototype._handleReadStreamEventsCompleted = function (correlationId, payload) {
        log.debug('TcpConnection - _handleReadStreamEventsCompleted', 'Received read stream completed', { commandCode: Commands.ReadStreamEventsForward, correlationId: correlationId, message: message });
        var callback = this._getResponseCallback(correlationId);
        var message = this._serializer.deserialize('ReadStreamEventsCompleted', payload);
        if (!callback) {
            log.debug('TcpConnection - _handleReadStreamEventsCompleted', 'No callback registered', { commandCode: Commands.ReadStreamEventsForward, correlationId: correlationId, noCallback: true });
        }
        else if (message.result === messages.ReadStreamResult.success) {
            callback(null, message);
        }
        else {
            callback('Read stream result: ' + message.result, message);
        }
    };
    TcpConnection.prototype._handleConnect = function () {
        log.info('TcpConnection - _handleConnect', 'Connected to the eventstore');
        if (this._onConnect) {
            this._onConnect();
        }
    };
    TcpConnection.prototype._handleEnd = function () {
        log.info('TcpConnection - _handleEnd', 'Connection received a FIN packet, closing the socket');
        if (this._onEnd) {
            this._onEnd();
        }
    };
    TcpConnection.prototype._handleClose = function (hadError) {
        log.info('TcpConnection - _handleClose', 'Connection closed (had error:' + hadError + ')');
        if (this._onClose) {
            this._onClose(hadError);
        }
    };
    TcpConnection.prototype._handleError = function (error) {
        log.error('TcpConnection - _handleError', 'Received an error (' + error + ')', { code: error.code });
        if (this._onError) {
            this._onError(error);
        }
    };
    TcpConnection.prototype._handleData = function (packet) {
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
        }
        else if (packet.length >= expectedPacketLength) {
            log.debug('TcpConnection - _handleData', 'Received a packet that is to big, split it it and retry');
            this._handleData(packet.slice(0, expectedPacketLength));
            this._handleData(packet.slice(expectedPacketLength));
        }
        else {
            log.debug('TcpConnection - _handleData', 'Received a packet that is to small, keep it and wait for the next packet');
            this._buffer = packet;
        }
    };
    TcpConnection.prototype._processCompletePacket = function (packet) {
        var commandCode = packet.readUInt8(TcpPacketOffset.command);
        var command = Commands.codeToCommand(commandCode);
        var correlationId = uuid.unparse(packet, TcpPacketOffset.correlationId);
        var payload = null;
        if (packet.length > TcpHeaderPart.full) {
            payload = packet.slice(TcpHeaderPart.full);
        }
        if (commandCode === Commands.WriteEventsCompleted) {
            this._handleWriteEventsCompleted(correlationId, payload);
        }
        else if (commandCode === Commands.DeleteStreamCompleted) {
            this._handleDeleteStreamCompleted(correlationId, payload);
        }
        else if (commandCode === Commands.ReadStreamEventsForwardCompleted) {
            this._handleReadStreamEventsCompleted(correlationId, payload);
        }
        else {
            log.warn('TcpConnection - _processCompletePacket', 'Received unknown packet type (' + command + ')', { commandCode: commandCode, correlationId: correlationId, unknownCommand: true });
            var callback = this._getResponseCallback(correlationId);
            if (callback) {
                callback();
            }
        }
    };
    TcpConnection.prototype._getResponseCallback = function (correlationId) {
        var responseInfo = this._responseInfos[correlationId];
        if (responseInfo) {
            if (!responseInfo.keepAlive) {
                delete this._responseInfos[correlationId];
            }
            return responseInfo.callback;
        }
        else {
            return function () {
            };
        }
    };
    TcpConnection.prototype._sendTcpPacket = function (commandId, payload, cb) {
        var correlationId = uuid.v4();
        var responseInfo = new ResponseInfo(cb, false);
        this._responseInfos[correlationId] = responseInfo;
        var packet = this._createTcpPacket(commandId, correlationId, payload);
        this._socket.write(packet);
    };
    TcpConnection.prototype._createTcpPacket = function (commandId, correlationId, payload) {
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
    };
    return TcpConnection;
})();
var EventStore = (function () {
    function EventStore() {
    }
    EventStore.createConnection = function () {
        return new TcpConnection();
    };
    return EventStore;
})();
module.exports = EventStore;
