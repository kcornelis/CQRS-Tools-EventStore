# Typed-Eventstore

Eventstore client POC in typescript.
Implemented:
- Ping
- AppendToStream
- DeleteStream
- ReadStreamEventsForward

## Grunt

Build: 

	grunt
	
Run test: 

	grunt test
	
Run test with console logs: 

	grunt log test	


## Proto

Original proto file: 

	EventStore => /src/Protos/ClientAPI/ClientMessageDtos.proto
	
Original tcp commands: 

	EventStore => /src/EventStore.Core/Services/Transport/Tcp/TcpCommand.cs




# MIT License

Copyright (c) 2015 Kevin Cornelis