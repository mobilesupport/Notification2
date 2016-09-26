function onSignOutConfirm(button) {
    if(button==2){
        return;//To do nothing when click "No" button
    }else if(button==1){

         dbmanager.getUserProfileData(function(returnData){

             if(returnData.rows.length>0){
                 var accessId = returnData.rows.item(0).uid;
                 postLogout(accessId);
    
                }   
            else{
                alert("Data retrieved failed");
            }
        });    
        
    }else{
        //To do nothing but dimiss the dialog when user clicks on the screen rather than yes-no button
    }
}


function notificationListDisplay(){
         
    dbmanager.getUserProfileData(function(returnData){

         if(returnData.rows.length>0){
             var accessId = returnData.rows.item(0).uid;
             postNotification(accessId);
           
        }   
        else{
            alert("Data retrieved failed");
        }
    });    

    

};