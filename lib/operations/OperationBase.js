/// <reference path="../../typings/all.d.ts" />
var uuid = require('node-uuid');
var Serializer = require('../Serializer');
var TcpPacket = require('../TcpPacket');
var OperationBase = (function () {
    function OperationBase(commandCode, requestType, responseType) {
        this._correlationId = uuid.v4();
        this._commandCode = commandCode;
        this._requestType = requestType;
        this._responseType = responseType;
    }
    OperationBase.prototype.getCorrelationId = function () {
        return this._correlationId;
    };
    OperationBase.prototype.getNetworkPackage = function () {
        var serializer = new Serializer();
        var payload = new Buffer(this.getMessage() ? serializer.serialize(this._requestType, this.getMessage()) : []);
        return new TcpPacket(payload, this._commandCode, this._correlationId);
    };
    OperationBase.prototype.getMessage = function () {
        return null;
    };
    OperationBase.prototype.handleNetworkPackage = function (package) {
        throw new Error('handle response not implemented');
    };
    OperationBase.prototype.parseMessage = function (package) {
        var serializer = new Serializer();
        return serializer.deserialize(this._responseType, package.message);
    };
    return OperationBase;
})();
module.exports = OperationBase;
