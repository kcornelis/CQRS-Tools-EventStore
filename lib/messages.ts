/// <reference path="../typings/all.d.ts" />

import ProtoBuf = require('protobufjs');
import common = require('./common');

export interface IMessage { }

export class DeleteStream implements IMessage {

	eventStreamId: string;
	expectedVersion: number;
	requireMaster: boolean;
	hardDelete: boolean;

	constructor(eventStreamId: string = null, expectedVersion: number = common.ExpectedVersion.append,
			requireMaster: boolean = true, hardDelete: boolean = true) {
		this.eventStreamId = eventStreamId;
		this.expectedVersion = expectedVersion;
		this.requireMaster = requireMaster;
		this.hardDelete = hardDelete;
	}
}
