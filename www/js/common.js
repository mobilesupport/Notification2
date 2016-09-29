var db;
var userNameInput;
var passwordInput;

var loading = {
    
    //add loading page when call
    startLoading:function(){
        $(".app").prepend("<div class='loadingPage'><div class='loadingFrame'><img class='loadingIcon' src='img/loading_large.gif'></img></div></div>");
    },
    
    //remove loading page when call
    endLoading:function(){
        $(".loadingPage").remove();
    }
};

var dbmanager = {
    initdb:function(){
        db = window.openDatabase("Database", "1.0", "Notification", 200000);
    },

     //select user profile data
    getUserProfileData:function(returnData){
        db.transaction(function(tx){
            
            tx.executeSql("SELECT * FROM userprofile", [], function(tx, rs){
                returnData(rs);
          }, this.errorExecuteSQL);
        });
         
    },
    
    //select notfication data
    getNotifyListData:function(returnData){
        db.transaction(function(tx){
           tx.executeSql('SELECT * FROM notifylist', [], function(tx, rs){
              
                returnData(rs);
          }, this.errorExecuteSQL);
        });
         
    },
    
    successExecuteSQL:function(){
        //success to executeSQL
    },
    
    errorExecuteSQL:function(err){
        //fail executeSQL
    },

};

function onDeviceReady() {

    document.addEventListener("backbutton", onBackKeyDown, false);
    networkChecking(); //Check internet availability once device ready
}

function networkChecking(){
    //Checking internet availability
 
  if(navigator.network.connection.type == Connection.NONE){

      navigator.notification.alert("No internet connection.", function(){}, "Alert", "Ok");    
      return false;

  }else{ 
      return true; }
}


function onExitConfirm(button) {
    if(button==2){
        return; //To do nothing when click "No" button
    }else if(button==1){
        navigator.app.exitApp(); //To exit the app when click "Yes" button
    }
}

function login(){
    
    var check = networkChecking();
    
    if(check == true){
        loading.startLoading();
         userNameInput=$("#username").val();
        passwordInput=$("#password").val();

        requestLogin(userNameInput, passwordInput);     
    }
   
};


function appendDetail(pageNum){
    //To show the specfic notification message detail according to specfic notifaction clicked or page navigation 
            
     dbmanager.getNotifyListData(function(returnData){

     if(returnData.rows.length>0){
             $('#dt_detail').html(setDetailDateFormat(returnData.rows.item(pageNum).issueDate));
             $('#ip_detail').html(returnData.rows.item(pageNum).ipAdd);
             $('#sys_detail').html(returnData.rows.item(pageNum).sysName);
             $('#syscon_detail').html(returnData.rows.item(pageNum).sysContact);
             $('#syslc_detail').html(returnData.rows.item(pageNum).sysLoc);
             $('#sts_detail').html(returnData.rows.item(pageNum).issueSts);
        }
    }); 
}

function setDetailDateFormat(str)
{
    //set date time format to yyyy/mm/dd hh:mm:ss
    return str.substring(0,4)+"/"+str.substring(4,6)+"/"+str.substring(6,8)+"  "+ str.substring(8,10)+":"+str.substring(10,12)+":"+str.substring(12,14)
}

function setNotifyDateFormat(str)
{
    //set date time format to dd/mm/yyyy hh:mm:am/pm
    
    var getHour = str.substring(8,10);
    var hour;
    var ext;
    
    if(getHour > 12){
        ext = 'pm';
        hour = getHour - 12;
    }
    if(getHour < 12){
        
        hour = getHour;
        ext = 'am';
    }
    if(getHour == 12){
        hour = getHour;
        ext = 'pm';
    }
    if(getHour == 00){
        hour = 12;
        ext = 'am';
    }


    return str.substring(6,8)+"/"+str.substring(4,6)+"/"+str.substring(0,4)+"  "+ hour+":"+str.substring(10,12)+ext;
}
    