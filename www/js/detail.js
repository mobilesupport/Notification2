function displayMsgDetail(pageNum){
  
       if (idString == null) {
           
           if (window.location.search.split('?').length > 1) {
               
                var params = window.location.search.split('?')[1].split('&');
                for (var i = 0; i < params.length; i++) {
                    var key = params[i].split('=')[0];
                    var value = decodeURIComponent(params[i].split('=')[1]);

                    idString = value;
                }
            }
           
                dbmanager.getNotifyListData(function(returnData){

                if(returnData.rows.length>0){
                    
                    var count = returnData.rows.length;
                    totalPage = returnData.rows.length-1;

                    for(var i=0;i<count;i++)
                    {
                      if(returnData.rows.item(i).issueID == idString)
                          {
                              pageNum = i;
                              break;
                          }
                    }
                    pageMovement(pageNum); 
                    appendDetail(pageNum);
                    
                 }   
                else{
                    alert("Data retrieve failed");

                }
          });    
        }else{
            
            dbmanager.getNotifyListData(function(returnData){

                if(returnData.rows.length>0){
                    idString = returnData.rows.item(pageNum).issueID;
                    pageMovement(pageNum); 
                    appendDetail(pageNum);
                 }   
                else{
                    alert("Data retrieve failed");

                }
          }); 
        }
};


function sharetoSocial(){

        sharing.initShareSheet();
}

function pageMovement(passNum)
{
    pageNum = passNum;

     if(pageNum == 0){

        $( "#previous" ).hide();
    }else{
        $( "#previous" ).show();
    }

    if(pageNum == totalPage){
        $( "#next" ).hide();
    }else{
        $( "#next" ).show();
    }
                   
}

function onDeleteConfirm(button) {
    if(button==2){
        return; //To do nothing when click "No" button
    }else if(button==1){
        postDelete(idString); //Delete the msg
    }else{
        //To do nothing but dimiss the dialog when user clicks on the screen rather than yes-no button
    }
}