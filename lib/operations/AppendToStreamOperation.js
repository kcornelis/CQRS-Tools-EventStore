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
var AppendToStreamOperation = (function (_super) {
    __extends(AppendToStreamOperation, _super);
    function AppendToStreamOperation(stream, expectedVersion, events) {
        _super.call(this, Commands.WriteEvents, 'WriteEvents', 'WriteEventsCompleted');
        this._deferred = Q.defer();
        this._stream = stream;
        this._expectedVersion = expectedVersion;
        this._events = events;
    }
    AppendToStreamOperation.prototype.getMessage = function () {
        return new messages.WriteEvents(this._stream, this._expectedVersion, this._events);
    };
    AppendToStreamOperation.prototype.getPromise = function () {
        return this._deferred.promise;
    };
    AppendToStreamOperation.prototype.handleNetworkPackage = function (packet) {
        var response = this.parseMessage(packet);
        if (response.result === results.OperationResult.success) {
            this._deferred.resolve(response);
        }
        else {
            this._deferred.reject(response);
        }
    };
    return AppendToStreamOperation;
})(OperationBase);
module.exports = AppendToStreamOperation;
