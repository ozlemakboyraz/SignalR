namespace SignalR.Web.Models
{

    //burası sadece data yani property tutacaksa class değil de record olsun
    public record Product(int Id, string Name, decimal Price) //.net 8 primary constructor
    {

       

    }
}


