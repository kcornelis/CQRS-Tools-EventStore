/// <reference path="../typings/all.d.ts" />

import messages = require('./messages');
import Q = require('q');

interface IConnection {
	connect();
	onConnect(callback: () => void);
	onError(callback: (error) => void);

	ping(): Q.Promise<void>;

	appendToStream(stream: string, expectedVersion: number, events: messages.NewEvent[]): Q.Promise<messages.WriteEventsCompleted>;
	appendToStream(stream: string, expectedVersion: number, event: messages.NewEvent): Q.Promise<messages.WriteEventsCompleted>;

	deleteStream(stream: string, expectedVersion: number): Q.Promise<messages.DeleteStreamCompleted>;
	deleteStream(stream: string, expectedVersion: number, hardDelete: boolean): Q.Promise<messages.DeleteStreamCompleted>;

	readStreamEventsForward(stream: string, from: number, max: number): Q.Promise<messages.ReadStreamEventsCompleted>;
}

export = IConnection;
