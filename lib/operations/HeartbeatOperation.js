/// <reference path="../../typings/all.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OperationBase = require('./OperationBase');
var Commands = require('../Commands');
var Q = require('q');
var HeartbeatOperation = (function (_super) {
    __extends(HeartbeatOperation, _super);
    function HeartbeatOperation() {
        _super.call(this, Commands.HeartbeatResponseCommand, '', ''); // no message
        this._deferred = Q.defer();
    }
    HeartbeatOperation.prototype.getPromise = function () {
        return this._deferred.promise;
    };
    HeartbeatOperation.prototype.handleNetworkPackage = function (packet) {
        this._deferred.resolve(null);
    };
    return HeartbeatOperation;
})(OperationBase);
module.exports = HeartbeatOperation;
