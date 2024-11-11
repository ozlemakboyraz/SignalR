document.addEventListener("DOMContentLoaded", function () {


    //hub bağlantısı
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/exampleTypeSafeHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();



    const broadcastMessageToAllClientHubMethodCall = "BroadcastMessageToAllClient";
    const receiveMessageForAllClientClientMethodCall = "ReceiveMessageForAllClient";

    const broadcastMessageToCallerClient = "BroadcastMessageToCallerClient";
    const receiveMessageForCallerClient = "ReceiveMessageForCallerClient";


    const broadcastMessageToOthersClient = "BroadcastMessageToOthersClient";
    const receiveMessageForOthersClient = "ReceiveMessageForOthersClient";

    const broadcastMessageToIndividualClient = "BroadcastMessageToIndividualClient";
    const receiveMessageForIndividualClient = "ReceiveMessageForIndividualClient";

    const receiveConnectedClientCountAllClient = "ReceiveConnectedClientCountAllClient";


    const broadcastTypedMessageToAllClient = "BroadcastTypedMessageToAllClient";
    const receiveTypedMessageToAllClient = "ReceiveTypedMessageToAllClient";



   /* ---------------------------------Gruplar----------------------------------------------------------------------------*/
   
    const groupA = "GroupA";
    const groupB = "GroupB";
    let currentGroupList = [];


        //gruba girip çıktıgı zaman burası çalışcam. empty ile önce grubu temizleyecek
        function refreshGroupList() {

            $("#groupList").empty();
            currentGroupList.forEach(x => {
                $("#groupList").append(`<p>${x}</p>`)
            })
        }



        //gruba ekleme ve çıkarma işlemi yapcam
        document.getElementById("btn-groupA-add").addEventListener("click", function () {


            connection.invoke("AddGroup", groupA).then(() => {
                //ekleme başarılı olura gruba ekliyor ve listeyi güncellemek lazım
                currentGroupList.push(groupA);
                refreshGroupList();
            })
        });


        document.getElementById("btn-groupA-remove").addEventListener("click", function () {

            connection.invoke("RemoveGroup", groupA).then(() => {



                currentGroupList = currentGroupList.filter(x => x !== groupA)  //gruptan olmayanı çıkarıyorum sonra yine güncelliyorum
                refreshGroupList();
            })
        });


        document.getElementById("btn-groupB-add").addEventListener("click", function () {


            connection.invoke("AddGroup", groupB).then(() => {
                //ekleme başarılı olura gruba ekliyor ve listeyi güncellemek lazım
                currentGroupList.push(groupB);
                refreshGroupList();
            })
        });


        document.getElementById("btn-groupB-remove").addEventListener("click", function () {

            connection.invoke("RemoveGroup", groupB).then(() => {



                currentGroupList = currentGroupList.filter(x => x !== groupB)  //gruptan olmayanı çıkarıyorum sonra yine güncelliyorum
                refreshGroupList();
            })
        });

   
    document.getElementById("btn-groupA-send-message").addEventListener("click", function () {


        const message = "Group A Mesaj";
        connection.invoke("BroadcastMessageToGroupClients", groupA, message)
            .catch(err => console.error("hata", err))
        console.log("mesaj gönderildi")
    })

    document.getElementById("btn-groupB-send-message").addEventListener("click", function () {


        const message = "Group B Mesaj";
        connection.invoke("BroadcastMessageToGroupClients", groupB, message)
            .catch(err => console.error("hata", err))
        console.log("mesaj gönderildi")
    })
  
    connection.on("ReceiveMessageForGroupClients", (message) => {
        console.log("Gelen mesaj", message);
    });


    /* --------------------------------------------------------------------------------------------------------*/





    function start() {
        connection.start()
            .then(() => {
                console.log("hub ile bağlantı kuruldu");
                $("#connectionId").html(`Connection Id : ${connection.connectionId}`);
            })
            .catch(() => {
                setTimeout(start, 5000);
            });
    }




    //hazır aktif client sayımızz(örneğin chat odasında kaç kişi var)
    const span_client_count = $("#span-connected-client-count");
    connection.on(receiveConnectedClientCountAllClient, (count) => {
        span_client_count.text(count);
        console.log("connected client count", count);
    });


   




    //-----------------------------SUBSCRİBES----------------------------------------------------

    //hub çağrıldıgı zaman tetiklenecek olan metotu da on metotu ile abone oldum (subscribe)
    connection.on(receiveMessageForAllClientClientMethodCall, (message) => {
        console.log("Gelen mesaj", message);
    });

    //hub çağrıldıgı zaman tetiklenecek olan metotu da on metotu ile abone oldum (subscribe)
    connection.on(receiveMessageForCallerClient, (message) => {
        console.log("(Caller) Gelen mesaj", message);
    });


    connection.on(receiveMessageForOthersClient, (message) => {  //hub çağrıldıgı zaman tetiklenecek olan metotu da on metotu ile abone oldum kendisi dışındakiler gelecek others (subscribe)
        console.log("(Others) Gelen mesaj", message);
    });


    connection.on(receiveMessageForIndividualClient, (message) => {
        console.log("(individual) Gelen mesaj", message);
    });

    connection.on(receiveTypedMessageToAllClient, (message) => {
        console.log("Gelen ürün", message);
    });






    // Buton tıklama olayı
    document.getElementById("btn-send-message-all-client").addEventListener("click", function () {
        const message = "hellooo";

        //hub'ı tetikledim broadcastMesaageToAllClientHubMethodCall
        connection.invoke(broadcastMessageToAllClientHubMethodCall, message)
            .catch(err => console.error("hata", err))
            console.log("mesaj gönderildi")

    });


    document.getElementById("btn-send-message-caller-client").addEventListener("click", function () {
        const message = "hellooo";

    
        connection.invoke(broadcastMessageToCallerClient, message)
            .catch(err => console.error("hata", err))
        console.log("mesaj gönderildi")

    });

    document.getElementById("btn-send-message-others-client").addEventListener("click", function () {
        const message = "hellooo";


        connection.invoke(broadcastMessageToOthersClient, message)
            .catch(err => console.error("hata", err))
        console.log("mesaj gönderildi")

    });

    document.getElementById("btn-send-message-individual-client").addEventListener("click", function () {

        const message = "hellooo";
        const connectionId = $("#text-connectionId").val();
        connection.invoke(broadcastMessageToIndividualClient, connectionId,message)
            .catch(err => console.error("hata", err))
        console.log("mesaj gönderildi")
    });

 
    document.getElementById("btn-send-typed-message-all-client").addEventListener("click", function () {


        const product = { id: 1, name: "pen 1", price: 200 };

        connection.invoke(broadcastTypedMessageToAllClient, product)
            .catch(err => console.error("hata", err))
        console.log("Ürün gönderildi")

    });



  

    start();
});
 