/// <reference path="../typings/all.d.ts" />
var uuid = require('node-uuid');
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
var TcpPacket = (function () {
    function TcpPacket(data, commandCode, correlationId) {
        if (!commandCode) {
            this._data = data;
        }
        else {
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
    Object.defineProperty(TcpPacket.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TcpPacket.prototype, "expectedPacketLength", {
        get: function () {
            if (this._data.length <= TcpHeaderPart.contentLength) {
                return -1;
            }
            var contentLength = this._data.readUInt32LE(TcpPacketOffset.contentLength);
            return contentLength + TcpHeaderPart.contentLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TcpPacket.prototype, "isIncomplete", {
        get: function () {
            if (this._data.length <= TcpHeaderPart.contentLength) {
                return true;
            }
            return this._data.length < this.expectedPacketLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TcpPacket.prototype, "isToLarge", {
        get: function () {
            return this._data.length > this.expectedPacketLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TcpPacket.prototype, "commandCode", {
        get: function () {
            return this._data.readUInt8(TcpPacketOffset.command);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TcpPacket.prototype, "correlationId", {
        get: function () {
            return uuid.unparse(this._data, TcpPacketOffset.correlationId);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TcpPacket.prototype, "message", {
        get: function () {
            if (this._data.length > TcpHeaderPart.full) {
                // remove the header
                return this._data.slice(TcpHeaderPart.full);
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return TcpPacket;
})();
module.exports = TcpPacket;
