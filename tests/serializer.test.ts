/// <reference path="../typings/all.d.ts" />

require('should');
import messages = require('../lib/messages');
import Serializer = require('../lib/Serializer');

describe('Serializer', () => {

	describe('When serializing a message', () => {

		var serializer = new Serializer();

		it('it should deserialize with the same values', () => {

			var original = new messages.DeleteStream('abc', 10, true, false);
			var buffer = serializer.serialize('DeleteStream', original);
			var copy = serializer.deserialize<messages.DeleteStream>('DeleteStream', buffer);

			copy.eventStreamId.should.eql('abc');
			copy.expectedVersion.should.eql(10);
			copy.requireMaster.should.eql(true);
			copy.hardDelete.should.eql(false);
		});
	});
});
