/// <reference path="../../typings/all.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OperationBase = require('./OperationBase');
var Commands = require('../Commands');
var messages = require('../messages');
var results = require('../results');
var Q = require('q');
var DeleteStreamOperation = (function (_super) {
    __extends(DeleteStreamOperation, _super);
    function DeleteStreamOperation(stream, expectedVersion, hardDelete, requireMaster) {
        _super.call(this, Commands.DeleteStream, 'DeleteStream', 'DeleteStreamCompleted');
        this._deferred = Q.defer();
        this._stream = stream;
        this._expectedVersion = expectedVersion;
        this._requireMaster = requireMaster;
        this._hardDelete = hardDelete;
    }
    DeleteStreamOperation.prototype.getMessage = function () {
        return new messages.DeleteStream(this._stream, this._expectedVersion, this._requireMaster, this._hardDelete);
    };
    DeleteStreamOperation.prototype.getPromise = function () {
        return this._deferred.promise;
    };
    DeleteStreamOperation.prototype.handleNetworkPackage = function (packet) {
        var response = this.parseMessage(packet);
        if (response.result === results.OperationResult.success) {
            this._deferred.resolve(response);
        }
        else {
            this._deferred.reject(response);
        }
    };
    return DeleteStreamOperation;
})(OperationBase);
module.exports = DeleteStreamOperation;
