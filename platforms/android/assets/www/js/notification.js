function onSignOutConfirm(button) {
    if(button==2){
        return;
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
        //To do nothing
    }
}


function notifyshow(){

       dbmanager.getUserProfileData(function(returnData){

             if(returnData.rows.length>0){
                 var accessId = returnData.rows.item(0).uid;
                 postNotification(accessId);
    
                }   
            else{
                alert("Data retrieved failed");
            }
        });    

    dbmanager.getNotifyListData(function(returnData){

             if(returnData.rows.length>0){
                 var count = returnData.rows.length;
                    var contained_divs = '';
                  
                for(var i=0;i<count;i++)
                {
                    contained_divs += '<div class="notifyview" id="'+returnData.rows.item(i).issueID +'"><label id="headline">'+ returnData.rows.item(i).issueDate +'</label> <label id="headline">'+ returnData.rows.item(i).sysName +' </label><label id="notifymsg">'+ returnData.rows.item(i).issueSts +' </label></div>';

                }
                $('#notifybox').append(contained_divs);

            }   
        else{
            alert("Login failed. Username or password not matched");

        }
  });    

};