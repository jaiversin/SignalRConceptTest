package com.zsoft.SignalA.transport.longpolling;

import com.zsoft.SignalA.ConnectionBase;
import com.zsoft.SignalA.transport.ITransport;
import com.zsoft.SignalA.transport.StateBase;

public class LongPollingTransport implements ITransport {

	@Override
	public StateBase CreateInitialState(ConnectionBase connection) {
		return new DisconnectedState(connection);
	}

}
