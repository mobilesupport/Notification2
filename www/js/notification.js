function onSignOutConfirm(button) {
    if(button==2){
        return;//To do nothing when click "No" button
    }else if(button==1){

         dbmanager.getUserProfileData(function(returnData){

             if(returnData.rows.length>0){
                 var accessId = returnData.rows.item(0).UserID;
                 postLogout(accessId);
    
                }   
        });    
        
    }
}

function notifyNetworkChecking(){
  //Checking internet availability
      if(navigator.network.connection.type == Connection.NONE){
           
          navigator.notification.alert("No internet connection.", function(){}, "Alert", "Ok"); 
          //retrieve current data from local storage if no internet
           notificationListDisplay();
          
      }else{ 
            retrieveNotificationList();
	  } 
}


function retrieveNotificationList(){          
//reload data from the server and restore in local storage
    dbmanager.getUserProfileData(function(returnData){

         if(returnData.rows.length>0){
             var accessId = returnData.rows.item(0).UserID;
             postNotification(accessId);
        }   
    });    

};

function notificationListDisplay(){
    
    //Display all notification msg in list view from local storage
    dbmanager.getNotifyListData(function(returnData){

     if(returnData.rows.length>0){
         var count = returnData.rows.length;
            var containedDivs = '';
            var backgroundColor, color;

                for(var i=0;i<count;i++)
                {   
                    if(returnData.rows.item(i).read==0)
                        {
                            //If the msg is unread
                            backgroundColor = "white";
                            color = "black";
                        }else{
                            backgroundColor = "#E8E8E8";
                            color = "#5E5E5E";
                        }

                    containedDivs += '<div class="notifyview" id="'+returnData.rows.item(i).issueID +'" style="background-color:'+backgroundColor+'; color:'+color+';"><label class="headline" id="nfdatetime">'+ setNotifyDateFormat(returnData.rows.item(i).issueDate) +'</label> <label class="headline" id="nfsysname">'+ returnData.rows.item(i).SystemName +' </label><label class="notifymsg" id="nfstatus">'+ returnData.rows.item(i).IssueStatus +' </label></div>';

                }
                $('#notifybox').append(containedDivs);

            }   
        });  
    
    loading.endLoading();
}
