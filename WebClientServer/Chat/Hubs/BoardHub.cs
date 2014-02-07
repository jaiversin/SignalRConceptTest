using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Drawing;

namespace Board.Hubs
{
    public class BoardHub : Hub
    {
        public void Signal(Message data)
        {
            // Call the addNewMessageToPage method to update clients.
            Clients.Others.signal(data);
        }

        public class Stroke
        {
            public int x { get; set; }
            public int y { get; set; }
        }

        public class Message
        {
            public string type { get; set; }
            public MessageDetail MessageDetail { get; set; }

        }

        public class MessageDetail
        {
            public List<Stroke> Stroke { get; set; }
            public string tool { get; set; }
            public string color { get; set; }
        }
    }


}