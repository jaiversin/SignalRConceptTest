package com.zsoft.SignalA.transport.longpolling;

import java.util.concurrent.atomic.AtomicBoolean;

import com.zsoft.SignalA.ConnectionBase;
import com.zsoft.SignalA.ConnectionState;
import com.zsoft.SignalA.transport.StateBase;
import com.zsoft.SignalA.SendCallback;

public class DisconnectedState extends StateBase {
	private AtomicBoolean requestStart = new AtomicBoolean(false);
	
	public DisconnectedState(ConnectionBase connection) {
		super(connection);
	}

	@Override
	public ConnectionState getState() {
		return ConnectionState.Disconnected;
	}

	@Override
	public void Start() {
		requestStart.set(true);
		Run();
	}

	@Override
	public void Stop() {
	}

	@Override
	public void Send(CharSequence text, SendCallback callback) {
		callback.OnError(new Exception("Not connected"));
	}

	@Override
	protected void OnRun() {
		if(requestStart.get())
		{
	        ConnectingState s = new ConnectingState(mConnection);
	        mConnection.SetNewState(s);
		}
	}

}
