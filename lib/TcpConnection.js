/// <reference path="../typings/all.d.ts" />
/* tslint:disable:no-empty */
var net = require('net');
var Commands = require('./Commands');
var TcpPacket = require('./TcpPacket');
var operations = require('./operations');
var Settings = require('./Settings');
var log = require('./Logger');
var ConnectionSettings = (function () {
    function ConnectionSettings() {
    }
    return ConnectionSettings;
})();
var TcpConnection = (function () {
    function TcpConnection(settings) {
        if (settings === void 0) { settings = {}; }
        this._settings = new ConnectionSettings();
        this._buffer = null;
        this._runningOperations = {};
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
    TcpConnection.prototype.ping = function () {
        log.debug('TcpConnection - ping', 'Sending ping');
        var operation = new operations.PingOperation();
        this._sendOperation(operation);
        return operation.getPromise();
    };
    TcpConnection.prototype.appendToStream = function (stream, expectedVersion, events) {
        log.debug('TcpConnection - appendToStream', 'Append data to stream ' + stream + ', expected version ' + expectedVersion);
        var eventArray;
        if (Object.prototype.toString.call(events) === '[object Array]') {
            eventArray = events;
        }
        else {
            eventArray = [events];
        }
        var operation = new operations.AppendToStreamOperation(stream, expectedVersion, eventArray);
        this._sendOperation(operation);
        return operation.getPromise();
    };
    TcpConnection.prototype.deleteStream = function (stream, expectedVersion, hardDelete) {
        if (hardDelete === void 0) { hardDelete = false; }
        log.debug('TcpConnection - deleteStream', 'Delete stream ' + stream + ', expected version ' + expectedVersion);
        var operation = new operations.DeleteStreamOperation(stream, expectedVersion, hardDelete, Settings.requireMaster);
        this._sendOperation(operation);
        return operation.getPromise();
    };
    TcpConnection.prototype.readStreamEventsForward = function (stream, from, max) {
        log.debug('TcpConnection - readStreamEventsForward', 'Read stream ' + stream + ', from ' + from + ', max ' + max);
        var operation = new operations.ReadStreamForwardOperation(stream, from, max);
        this._sendOperation(operation);
        return operation.getPromise();
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
    TcpConnection.prototype._handleData = function (data) {
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
        }
        else if (packet.isToLarge) {
            log.debug('TcpConnection - _handleData', 'Received a packet that is to big, split it it and retry');
            this._handleData(data.slice(0, packet.expectedPacketLength));
            this._handleData(data.slice(packet.expectedPacketLength));
        }
        else {
            this._processCompletePacket(packet);
        }
    };
    TcpConnection.prototype._processCompletePacket = function (packet) {
        var operation = this._runningOperations[packet.correlationId];
        if (operation) {
            log.debug('TcpConnection - _processCompletePacket', 'Operation found for command ' + Commands.codeToCommand(packet.commandCode) + ' - ' + operation.getCorrelationId());
            delete this._runningOperations[packet.correlationId];
            operation.handleNetworkPackage(packet);
        }
        else if (packet.commandCode === Commands.HeartbeatRequestCommand) {
            this._sendOperation(new operations.HeartbeatOperation());
        }
        else if (packet.commandCode === Commands.HeartbeatResponseCommand) {
        }
        else {
            log.warn('TcpConnection - _processCompletePacket', 'No operation found for ' + Commands.codeToCommand(packet.commandCode) + ' with correlation id ' + packet.correlationId);
        }
    };
    TcpConnection.prototype._sendOperation = function (operation) {
        this._runningOperations[operation.getCorrelationId()] = operation;
        this._socket.write(operation.getNetworkPackage().data);
    };
    return TcpConnection;
})();
module.exports = TcpConnection;
