import messages = require('./messages');

interface IConnection {
	connect();
	onConnect(callback: () => void);
	onError(callback: (error) => void);

	ping(callback: (error?: any) => void);

	appendToStream(stream: string, expectedVersion: number, event: messages.NewEvent[], callback: (error?: any, result?: messages.WriteEventsCompleted) => void);
	appendToStream(stream: string, expectedVersion: number, events: messages.NewEvent, callback: (error?: any, result?: messages.WriteEventsCompleted) => void);

	deleteStream(stream: string, expectedVersion: number, callback: (error?: any, result?: messages.DeleteStreamCompleted) => void);
}

export = IConnection;
