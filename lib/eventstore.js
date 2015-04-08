/// <reference path="../typings/all.d.ts" />
/* tslint:disable:no-empty */
var net = require('net');
var uuid = require('node-uuid');
var Commands = require('./commands');
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
        this._buffer = null;
        this._responseInfos = {};
        this._settings.port = settings.port || 1113;
        this._settings.host = settings.host || '127.0.0.1';
    }
    TcpConnection.prototype.connect = function () {
        var _this = this;
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
    };
    TcpConnection.prototype.onConnect = function (callback) {
        this._onConnect = callback;
    };
    TcpConnection.prototype.onError = function (callback) {
        this._onError = callback;
    };
    TcpConnection.prototype.ping = function (callback) {
        this._sendTcpPacket(Commands.Ping, null, callback);
    };
    TcpConnection.prototype._handleConnect = function () {
        console.log('Connected to the eventstore');
        if (this._onConnect) {
            this._onConnect();
        }
    };
    TcpConnection.prototype._handleError = function (error) {
        console.log('Eventstore error: ' + error);
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
            // the received packet is to big, split it and retry
            this._handleData(packet.slice(0, expectedPacketLength));
            this._handleData(packet.slice(expectedPacketLength));
        }
        else {
            // the packet is to small, keep it in the buffer and wait for the next one
            this._buffer = packet;
        }
    };
    TcpConnection.prototype._processCompletePacket = function (packet) {
        var command = Commands.codeToCommand(packet.readUInt8(TcpPacketOffset.command));
        var correlationId = uuid.unparse(packet, TcpPacketOffset.correlationId);
        var payload = null;
        if (packet.length > TcpHeaderPart.full) {
            payload = packet.slice(TcpHeaderPart.full);
        }
        console.log('Received: ' + command + ' (' + correlationId + ')');
        var cb = this._getResponseCallback(correlationId);
        if (cb) {
            cb();
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
