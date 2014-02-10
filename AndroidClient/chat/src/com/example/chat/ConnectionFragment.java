package com.example.chat;


import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;

public class ConnectionFragment extends Fragment {

	private OnConnectionRequestedListener mListener;
	private OnDisconnectionRequestedListener mDisconnectListener = null;
	private EditText mAddressTextBox = null;
	
	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
	    View view = inflater.inflate(R.layout.connection_fragment, container, false);
	    
	    mAddressTextBox = (EditText) view.findViewById(R.id.address);
	    mAddressTextBox.setText("http://10.60.6.27/Chat/signalr/hubs/");
//	    mAddressTextBox.setText("http://10.0.2.2:8888");
	    Button button = (Button) view.findViewById(R.id.btnConnect);
	    button.setOnClickListener(new View.OnClickListener() {
	      @Override
	      public void onClick(View v) {
	    	  requestConnection();
	      }
	    });
	    Button disconnectButton = (Button) view.findViewById(R.id.btnDisconnect);
	    disconnectButton.setOnClickListener(new View.OnClickListener() {
	      @Override
	      public void onClick(View v) {
	    	  mDisconnectListener.DisconnectionRequested();
	      }
	    });

	    return view;
	}

	@Override
	public void onAttach(Activity activity)
	{
		super.onAttach(activity);
		if(activity instanceof OnConnectionRequestedListener)
		{
			mListener = (OnConnectionRequestedListener)activity;
		}
		else
			throw new ClassCastException(activity.toString() + " must implemenet ConnectionFragment.OnConnectionRequestedListener");

		if(activity instanceof OnDisconnectionRequestedListener)
		{
			mDisconnectListener = (OnDisconnectionRequestedListener)activity;
		}

	}
	
	protected void requestConnection() {
		Uri address = Uri.parse(mAddressTextBox.getText().toString());
		mListener.ConnectionRequested(address);
	}

	
	public interface OnConnectionRequestedListener
	{
		public void ConnectionRequested(Uri address);
	}
	
	
	
}
