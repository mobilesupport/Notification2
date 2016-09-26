
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//init custom sharing sheet
var sharing={

    initShareSheet:function(){
        $(".app").append("<div id='sharesheetbg' class='sharesheetbg'></div>");
        $("#sharesheetbg").append("<div id='sharesheet' class='sharesheet'></div>");
        $("#sharesheetbg").append("<button id='closeBtn' class='closeBtn'></button>");
        $("#sharesheet").append("<ul></ul>");
        $("#sharesheet ul").append("<li style='border:none;'>Share with</li>");
//        $("#sharesheet ul").append("<li onclick='sharing.emailShare();'><img src='img/emailapp.png'/><span>Email</span></li>");
//        $("#sharesheet ul").append("<li onclick='sharing.facebookShare();'><img src='img/fbapp.png'/><span>Facebook</span></li>");
        $("#sharesheet ul").append("<li onclick='sharing.whatsappShare();'><img src='img/whatsapp.png'/><span>Whatsapp</span></li>");
        
        $("#closeBtn").click(function(){
            sharing.closeShareSheet();
        });
    },
    
    closeShareSheet:function(){
        $("#sharesheetbg").remove();
    },

    
    whatsappShare:function(){
        var len,count,msg,text,issDate,sysName,issSts;
        
           dbmanager.getNotifyListData(function(returnData){
                
             if(returnData.rows.length>0){
                 
                 len = returnData.rows.length;
                 
                 for(var i=0;i<len;i++)
                        {
                          if(returnData.rows.item(i).issueID == idString)
                              {
                                  count = i;
                                  break;
                              }
                        }
                 
                 issDate=returnData.rows.item(count).issueDate;
                 sysName=returnData.rows.item(count).sysName;
                 issSts=returnData.rows.item(count).issueSts;
                 text = "Issue Date: "+issDate +"\n\n"+"System Name: "+sysName+"\n\n"+"Issue Status: "+issSts;
//                 msg = msg.html(text);
                 window.plugins.socialsharing.shareViaWhatsApp(text, null, null, function() {}, function(errormsg){alert(errormsg)});
             
             }   
            else{
                alert("Data retrieved failed");
            }
        });   
        
    },
    

}



