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

           dbmanager.getNotifyListData(function(returnData){
        
             if(returnData.rows.length>0){
                 var count = returnData.rows.length;
                    var contained_divs = '';
                 
                for(var i=0;i<count;i++)
                {
                    contained_divs += '<div class="notifyview" id="'+returnData.rows.item(i).issueID +'"><label id="headline">'+ setNotifyDateFormat(returnData.rows.item(i).issueDate) +'</label> <label id="headline">'+ returnData.rows.item(i).sysName +' </label><label id="notifymsg">'+ returnData.rows.item(i).issueSts +' </label></div>';

                }
                $('#notifybox').append(contained_divs);

            }   
  });    

};