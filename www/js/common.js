var db;
var userNameInput;
var passwordInput;

var loading = {
    
    //add loading page when calll
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
    networkChecking();
}

function networkChecking(){
    
  if(navigator.network.connection.type == Connection.NONE){

      navigator.notification.alert("No internet connection.", function(){}, "Alert", "Ok");    
      return false;

  }else{ 
      return true; }
}

function onExitConfirm(button) {
    if(button==2){
        return;
    }else if(button==1){
        navigator.app.exitApp();
    }else{
        
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

function appendDetail(num){
            
     dbmanager.getNotifyListData(function(returnData){

     if(returnData.rows.length>0){

             $('#dt_detail').html(returnData.rows.item(num).issueDate);
             $('#ip_detail').html(returnData.rows.item(num).ipAdd);
             $('#sys_detail').html(returnData.rows.item(num).sysName);
             $('#syscon_detail').html(returnData.rows.item(num).sysContact);
             $('#syslc_detail').html(returnData.rows.item(num).sysLoc);
             $('#sts_detail').html(returnData.rows.item(num).issueSts);
        }
    }); 
}
    