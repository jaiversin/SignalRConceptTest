package com.zsoft.SignalA.transport;

import com.zsoft.SignalA.ConnectionBase;

public interface ITransport {
	StateBase CreateInitialState(ConnectionBase connectionBase);
}
