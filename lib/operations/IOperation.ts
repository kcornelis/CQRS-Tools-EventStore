import TcpPacket = require('../TcpPacket');

interface IOperation {
	getCorrelationId(): string;
	getNetworkPackage(): TcpPacket;
	handleNetworkPackage(packet: TcpPacket);
}

export = IOperation;
