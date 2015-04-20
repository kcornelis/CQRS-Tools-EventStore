import TcpConnection = require('./TcpConnection');
import IConnection = require('./iconnection');

class EventStore {
	static createConnection(): IConnection {
		return new TcpConnection();
	}
}

export = EventStore;
