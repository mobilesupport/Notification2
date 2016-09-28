function displayMsgDetail(pageNum){
    
        //For 1st entry from notification page to detail page
       if (idString == null) {
           
           //To get the issueID from the url
           if (window.location.search.split('?').length > 1) {
               
                var params = window.location.search.split('?')[1].split('&');
                for (var i = 0; i < params.length; i++) {
                    var key = params[i].split('=')[0];
                    var value = decodeURIComponent(params[i].split('=')[1]);

                    idString = value;//get the issueID
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
                    pageNavigatorDisplay(pageNum); 
                    appendDetail(pageNum);
                    
                 }   

          });    
        }else{
            //When users move from one detail to another detail
            dbmanager.getNotifyListData(function(returnData){

                if(returnData.rows.length>0){
                    //To get current issueID
                    idString = returnData.rows.item(pageNum).issueID;
                    pageNavigatorDisplay(pageNum); 
                    appendDetail(pageNum);
                 }   

          }); 
        }
};


function sharetoSocial(){

        sharing.initShareSheet();//share to Whatsapp
}


function pageNavigatorDisplay(currentPageNum)
{
    //To decide which page navigator (previous and/or next) to dispaly
    pageNum = currentPageNum;

     if(pageNum == 0){

        $("#previous").hide();
    }else{
        $("#previous").show();
    }

    if(pageNum == totalPage){
        $("#next").hide();
    }else{
        $("#next").show();
    }
                   
}


function onDeleteConfirm(button) {
    if(button==2){
        return; //To do nothing when click "No" button
    }else if(button==1){
        
             postDelete(idString); //Delete the msg   
   
    }
}