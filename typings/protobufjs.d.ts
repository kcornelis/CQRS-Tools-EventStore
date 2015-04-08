// Type definitions for ProtoBuf.js
// Project: https://github.com/dcodeIO/ProtoBuf.js
// Definitions by: Panu Horsmalahti <https://github.com/panuhorsmalahti>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="./node.d.ts" />

declare module ProtoBuf {
	export interface IBuilder {
		build(name: string): any;
	}

	export interface IProtoBufMessage {
	    toArrayBuffer(): ArrayBuffer;
	    toBuffer(): Buffer;
	}

	export function loadProtoFile(filePath: string): IBuilder;

	export var convertFieldsToCamelCase: boolean;
}

declare module "protobufjs" {
    export = ProtoBuf;
}