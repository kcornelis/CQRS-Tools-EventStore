/// <reference path="../typings/all.d.ts" />
var common = require('./common');
var DeleteStream = (function () {
    function DeleteStream(eventStreamId, expectedVersion, requireMaster, hardDelete) {
        if (eventStreamId === void 0) { eventStreamId = null; }
        if (expectedVersion === void 0) { expectedVersion = common.ExpectedVersion.append; }
        if (requireMaster === void 0) { requireMaster = true; }
        if (hardDelete === void 0) { hardDelete = true; }
        this.eventStreamId = eventStreamId;
        this.expectedVersion = expectedVersion;
        this.requireMaster = requireMaster;
        this.hardDelete = hardDelete;
    }
    return DeleteStream;
})();
exports.DeleteStream = DeleteStream;
