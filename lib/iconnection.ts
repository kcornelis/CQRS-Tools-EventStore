import messages = require('./messages');

interface IConnection {
	connect();
	onConnect(callback: () => void);
	onError(callback: (error) => void);

	ping(callback: (error?: any) => void);

	appendToStreamRaw(message: messages.WriteEvents, callback: (error?: any, result?: messages.WriteEventsCompleted) => void);
	appendToStream(stream: string, expectedVersion: number, event: messages.NewEvent[], callback: (error?: any, result?: messages.WriteEventsCompleted) => void);
	appendToStream(stream: string, expectedVersion: number, events: messages.NewEvent, callback: (error?: any, result?: messages.WriteEventsCompleted) => void);

	deleteStreamRaw(message: messages.DeleteStream, callback: (error?: any, result?: messages.DeleteStreamCompleted) => void);
	deleteStream(stream: string, expectedVersion: number, callback: (error?: any, result?: messages.DeleteStreamCompleted) => void);

	readStreamEventsForward(stream: string, from: number, max: number, callback: (error?: any, result?: messages.ReadStreamEventsCompleted) => void);
}

export = IConnection;
