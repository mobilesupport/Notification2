function displayDetail(num){
  
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
                    totalpage = returnData.rows.length-1;

                    for(var i=0;i<count;i++)
                    {
                      if(returnData.rows.item(i).issueID == idString)
                          {
                              num = i;
                              break;
                          }
                    }
                    pageMovement(num); 
                    appendDetail(num);
                    
                 }   
                else{
                    alert("Data retrieve failed");

                }
          });    
        }else{
            
            dbmanager.getNotifyListData(function(returnData){

                if(returnData.rows.length>0){
                    idString = returnData.rows.item(num).issueID;
                    pageMovement(num); 
                    appendDetail(num);
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

function pageMovement(no)
{
    num = no;

     if(num == 0){

        $( "#previous" ).hide();
    }else{
        $( "#previous" ).show();
    }

    if(num == totalpage){
        $( "#next" ).hide();
    }else{
        $( "#next" ).show();
    }
                   
}