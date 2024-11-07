﻿using SignalR.Web.Models;

namespace SignalR.Web.Hubs
{
    public interface IExampleTypeSafeHub
    {
        Task ReceiveMessageForAllClient(string message);

        Task ReceiveTypedMessageToAllClient(Product product);


        Task ReceiveConnectedClientCountAllClient(int clientCount);


        Task ReceiveMessageForCallerClient(string message);

        Task ReceiveMessageForOthersClient(string message);

        Task ReceiveMessageForIndividualClient(string message);

        Task ReceiveMessageForGroupClients(string message);
    
    }
    
}

