using Microsoft.AspNetCore.SignalR;
using SignalR.Web.Models;

namespace SignalR.Web.Hubs
{
    public class ExampleTypeSafeHub:Hub<IExampleTypeSafeHub>
    {

       
        private static int ConnectionClientCount = 0;   //benim hub'ıma kaç tane client bağlanmış 
        public async Task BroadcastMessageToAllClient(string message)
        {
         
            //bu metot tüm clinetlarda çalışıyor
            await Clients.All.ReceiveMessageForAllClient(message);
            
        }



        public async Task BroadcastTypedMessageToAllClient(Product product)
        {
           
            await Clients.All.ReceiveTypedMessageToAllClient(product);

        }


        public async Task BroadcastMessageToCallerClient(string message)
        {
            //hangi client çağırdıysa o tetiklenmesi için metot

            await Clients.Caller.ReceiveMessageForCallerClient(message);

        }

        public async Task BroadcastMessageToOthersClient(string message)
        {
          
            await Clients.Others.ReceiveMessageForOthersClient(message);
            //ReceiveMessageForOthersClient bu metotda subscribe oluyorum
        }
        

         public async Task BroadcastMessageToIndividualClient(string connectionId , string message) //spesifik client kime göndermek istiyorsam
         {

            await Clients.Clients(connectionId).ReceiveMessageForIndividualClient(message);
         }








        //------------------GROUP------------------------------------------------------------------------
        //Group içerisinde bir client mesaj gönderdiği zaman tetiklenecek metot
        public async Task BroadcastMessageToGroupClients(string groupName , string message)
        {
            await Clients.Group(groupName).ReceiveMessageForGroupClients(message);
        }


        //gruba dahil olma
        public async Task AddGroup (string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            //dahil olduktan sonra 2 tane yeri tetiklemem lazım
            //1.bu metodu kim çağırdıysa ona mesaj dönmem lazım
            await Clients.Caller.ReceiveMessageForCallerClient($"{groupName} grubuna eklendiniz.");


            //sadece ilgili gruptaki kişilere mesajı gönderelim
            await Clients.Group(groupName).ReceiveMessageForGroupClients($"Kullanıcı({Context.ConnectionId}) {groupName} grubuna eklendi.");


            ////gruptaki diğer kişileri de bilgilendirelim =>kendisi dışındakileri
            //await Clients.Others.ReceiveMessageForOthersClient($"Kullanıcı({Context.ConnectionId}) {groupName} grubuna eklendi.");
        }



        //gruPtan çıkmak
        public async Task RemoveGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Caller.ReceiveMessageForCallerClient($"{groupName} grubundan ayrıldınız");

            await Clients.Group(groupName).ReceiveMessageForGroupClients($"Kullanıcı({Context.ConnectionId}) {groupName} grubundan çıktı.");

            //await Clients.Others.ReceiveMessageForOthersClient($"Kullanıcı({Context.ConnectionId}) {groupName} grubundan çıktı.");   ////gruptaki diğer kişileri de bilgilendirelim =>kendisi dışındakileri
        }

        //------------------END GROUP------------------------------------------------------------------------






        public override async Task OnConnectedAsync()
        {
            //connect oldukça
            ConnectionClientCount++;
            
            await Clients.All.ReceiveConnectedClientCountAllClient(ConnectionClientCount);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            ConnectionClientCount--;
            await Clients.All.ReceiveConnectedClientCountAllClient(ConnectionClientCount);

            await base.OnDisconnectedAsync(exception);
        }
    }
}
