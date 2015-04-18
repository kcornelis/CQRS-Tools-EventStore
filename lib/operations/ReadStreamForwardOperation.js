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
var ReadStreamForwardOperation = (function (_super) {
    __extends(ReadStreamForwardOperation, _super);
    function ReadStreamForwardOperation(stream, from, max) {
        _super.call(this, Commands.ReadStreamEventsForward, 'ReadStreamEvents', 'ReadStreamEventsCompleted');
        this._deferred = Q.defer();
        this._stream = stream;
        this._from = from;
        this._max = max;
    }
    ReadStreamForwardOperation.prototype.getMessage = function () {
        return new messages.ReadStreamEvents(this._stream, this._from, this._max);
    };
    ReadStreamForwardOperation.prototype.getPromise = function () {
        return this._deferred.promise;
    };
    ReadStreamForwardOperation.prototype.handleNetworkPackage = function (packet) {
        var response = this.parseMessage(packet);
        if (response.result === results.ReadStreamResult.success) {
            this._deferred.resolve(response);
        }
        else {
            this._deferred.reject(response);
        }
    };
    return ReadStreamForwardOperation;
})(OperationBase);
module.exports = ReadStreamForwardOperation;
