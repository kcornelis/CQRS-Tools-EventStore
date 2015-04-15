/// <reference path="../typings/all.d.ts" />

import ProtoBuf = require('protobufjs');
import common = require('./common');

export interface IMessage { }

export class DeleteStream implements IMessage {

	eventStreamId: string;
	expectedVersion: number;
	requireMaster: boolean;
	hardDelete: boolean;

	constructor(eventStreamId: string, expectedVersion: number = common.ExpectedVersion.any,
			requireMaster: boolean = true, hardDelete: boolean = false) {
		this.eventStreamId = eventStreamId;
		this.expectedVersion = expectedVersion;
		this.requireMaster = requireMaster;
		this.hardDelete = hardDelete;
	}
}

export class NewEvent implements IMessage {

	eventId: Buffer;
	eventType : string;
	dataContentType: number;
	metadataContentType: number;
	data: Buffer;
	metadata : Buffer;

	constructor(eventId: string = null, eventType: string = null, data: any = null, metadata: any = null) {
		eventId = eventId.replace(/[^0-9a-fA-F]/g, '');

		if (eventId.length !== 32) {
			throw new Error('eventId does not contain a valid GUID');
		}

		this.eventId = new Buffer(eventId, 'hex');
		this.eventType = eventType;
		this.populateData(data);
		this.populateMetadata(metadata);
	}

	populateData(data: any) {
		if (data) {
			if (Buffer.isBuffer(data)) {
				this.dataContentType = common.ContentType.binary;
				this.data = data;
			} else {
				this.dataContentType = common.ContentType.json;
				this.data = new Buffer(JSON.stringify(data));
			}
		} else {
			this.dataContentType = common.ContentType.binary;
			this.data = new Buffer([]);
		}
	}

	populateMetadata(metadata: any) {
		if (metadata) {
			if (Buffer.isBuffer(metadata)) {
				this.metadataContentType = common.ContentType.binary;
				this.metadata = metadata;
			} else {
				this.metadataContentType = common.ContentType.json;
				this.metadata = new Buffer(JSON.stringify(metadata));
			}
		} else {
			this.metadataContentType = common.ContentType.binary;
			this.metadata = new Buffer([]);
		}
	}
}

export class WriteEvents implements IMessage {

	eventStreamId: string;
	expectedVersion: number;
	events: NewEvent[];
	requireMaster: boolean;

	constructor(eventStreamId: string, expectedVersion: number = common.ExpectedVersion.any,
			events: NewEvent[] = null, requireMaster: boolean = true) {

		this.eventStreamId = eventStreamId;
		this.events = events || [];
		this.expectedVersion = expectedVersion;
		this.requireMaster = requireMaster;
	}
}

export class WriteEventsCompleted implements IMessage {
	result: number;
	message: string;
	firstEventNumber: number;
	lastEventNumber: number;
	preparePosition: number;
	commitPosition: number;
}
