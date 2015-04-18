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
var PingOperation = (function (_super) {
    __extends(PingOperation, _super);
    function PingOperation() {
        _super.call(this, Commands.Ping, '', ''); // no message
        this._deferred = Q.defer();
    }
    PingOperation.prototype.getPromise = function () {
        return this._deferred.promise;
    };
    PingOperation.prototype.handleNetworkPackage = function (packet) {
        this._deferred.resolve(null);
    };
    return PingOperation;
})(OperationBase);
module.exports = PingOperation;
