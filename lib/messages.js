/// <reference path="../typings/all.d.ts" />
var common = require('./common');
var DeleteStream = (function () {
    function DeleteStream(eventStreamId, expectedVersion, requireMaster, hardDelete) {
        if (expectedVersion === void 0) { expectedVersion = common.ExpectedVersion.any; }
        if (requireMaster === void 0) { requireMaster = true; }
        if (hardDelete === void 0) { hardDelete = false; }
        this.eventStreamId = eventStreamId;
        this.expectedVersion = expectedVersion;
        this.requireMaster = requireMaster;
        this.hardDelete = hardDelete;
    }
    return DeleteStream;
})();
exports.DeleteStream = DeleteStream;
var NewEvent = (function () {
    function NewEvent(eventId, eventType, data, metadata) {
        if (eventId === void 0) { eventId = null; }
        if (eventType === void 0) { eventType = null; }
        if (data === void 0) { data = null; }
        if (metadata === void 0) { metadata = null; }
        eventId = eventId.replace(/[^0-9a-fA-F]/g, '');
        if (eventId.length !== 32) {
            throw new Error('eventId does not contain a valid GUID');
        }
        this.eventId = new Buffer(eventId, 'hex');
        this.eventType = eventType;
        this.populateData(data);
        this.populateMetadata(metadata);
    }
    NewEvent.prototype.populateData = function (data) {
        if (data) {
            if (Buffer.isBuffer(data)) {
                this.dataContentType = common.ContentType.binary;
                this.data = data;
            }
            else {
                this.dataContentType = common.ContentType.json;
                this.data = new Buffer(JSON.stringify(data));
            }
        }
        else {
            this.dataContentType = common.ContentType.binary;
            this.data = new Buffer([]);
        }
    };
    NewEvent.prototype.populateMetadata = function (metadata) {
        if (metadata) {
            if (Buffer.isBuffer(metadata)) {
                this.metadataContentType = common.ContentType.binary;
                this.metadata = metadata;
            }
            else {
                this.metadataContentType = common.ContentType.json;
                this.metadata = new Buffer(JSON.stringify(metadata));
            }
        }
        else {
            this.metadataContentType = common.ContentType.binary;
            this.metadata = new Buffer([]);
        }
    };
    return NewEvent;
})();
exports.NewEvent = NewEvent;
var WriteEvents = (function () {
    function WriteEvents(eventStreamId, expectedVersion, events, requireMaster) {
        if (expectedVersion === void 0) { expectedVersion = common.ExpectedVersion.any; }
        if (events === void 0) { events = null; }
        if (requireMaster === void 0) { requireMaster = true; }
        this.eventStreamId = eventStreamId;
        this.events = events || [];
        this.expectedVersion = expectedVersion;
        this.requireMaster = requireMaster;
    }
    return WriteEvents;
})();
exports.WriteEvents = WriteEvents;
var WriteEventsCompleted = (function () {
    function WriteEventsCompleted() {
    }
    return WriteEventsCompleted;
})();
exports.WriteEventsCompleted = WriteEventsCompleted;
