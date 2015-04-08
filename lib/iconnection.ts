interface IConnection {
	connect();
	onConnect(callback: () => void);
	onError(callback: (error) => void);

	ping(callback: (error?: any) => void);
}

export = IConnection;
