var apiTimeOut = 20000;
var sha1Key = 8345627;
var registrationId; 
var webApiUrlDomain="http://192.168.1.19/notification_api";
var contentType = "application/x-www-form-urlencoded";

function setRegistrationId(regId){
    //To set registration id for global variable use 
    registrationId = regId;
}

function requestLogin(username, password){

        $.ajax({
      url: webApiUrlDomain,
      type: "GET",  
      headers: {
        "Content-Type": contentType
      },
      timeout: apiTimeOut,  
      success: function(data, status, xhr) {
        
        postLogin(username, password);
      },
         
      error:function (xhr, ajaxOptions, thrownError){
           loading.endLoading();
           navigator.notification.alert("Server down. Please try again later.", function(){}, "Alert", "Ok");
          
        }
    }) 
    
}

function postLogin(username, password){
    
    var requestUrl=webApiUrlDomain + "/api/user/login";
    var valueStr=username+password+registrationId+sha1Key;
    var hashedStr=SHA1(valueStr);
    
    try{
        $.ajax({
      url: requestUrl,
      method: "POST",
      headers: {
        "Content-Type": contentType
      },
      data:"loginId=" + username + "&password="+password+"&registrationId="+ registrationId + "&checksum=" + hashedStr,
      timeout: apiTimeOut,    
      success: function(data, status, xhr) {
         // alert(JSON.stringify(data));
          //Store user profile data in local storage for later retrieve purpose
          storeProfile(data);
      },
      error:function (xhr, ajaxOptions, thrownError){
          if(xhr.status==0)
            {}
          else{
              var newJsonObj=$.parseJSON(xhr.responseText);
              navigator.notification.alert(newJsonObj.Message, function(){}, "Alert", "Ok");
          }
        
          loading.endLoading();
        }
    })
        
    }
    catch(ex){
        //show error message
    }
}

function postNotification(accessId){
 
    var requestUrl=webApiUrlDomain + "/api/notification/PostNotification";
    var valueStr=accessId+sha1Key;
    var hashedStr=SHA1(valueStr);
    
    try{
        $.ajax({
      url: requestUrl,
      method: "POST",
      headers: {
        "Content-Type": contentType
      },
      data:"accessId=" + accessId + "&checksum=" + hashedStr,
      timeout: apiTimeOut,    
      success: function(data, status, xhr) {
         
        storeNotification(data);//Store notification message data in local storage
         
        notificationListDisplay();  

      },
      error:function (xhr, ajaxOptions, thrownError){
           //Login unsuccessfully
          if(xhr.status==0)
            {}
          else
            navigator.notification.alert("Login failed", function(){}, "Alert", "Ok");
          
          loading.endLoading();
        }
    })
        
    }
    catch(ex){
         //show error message
    }
}

function postLogout(accessId)
{

    var requestUrl=webApiUrlDomain + "/api/logout/logout";
    var valueStr=accessId+sha1Key;
    var hashedStr=SHA1(valueStr);

       try{
            $.ajax({
          url: requestUrl,
          method: "POST",
          headers: {
            "Content-Type": contentType
          },
          data:"accessId=" + accessId + "&checksum=" + hashedStr,
          timeout: apiTimeOut,    
          success: function(data, status, xhr) {
      
              var newJsonObj=$.parseJSON(xhr.responseText);
              
              navigator.notification.alert(newJsonObj.Message, function(){}, "Alert", "Ok");
                window.location.href = "index.html";
          },
          error:function (xhr, ajaxOptions, thrownError){
             
              if(xhr.status==0)
                {
                    navigator.notification.alert(xhr.statusText,function(){}, "Alert", "Ok");
                }
              else
                navigator.notification.alert(xhr.responseText, function(){}, "Alert", "Ok");
                
              loading.endLoading();
            }
        })

        }
        catch(ex){
             //show error message
        }
}

function postDelete(issueId)
{

    var requestUrl=webApiUrlDomain + "/api/notification/PostDeleteNotification";
    var valueStr=issueId+sha1Key;
    var hashedStr=SHA1(valueStr);

       try{
            $.ajax({
          url: requestUrl,
          method: "POST",
          headers: {
            "Content-Type": contentType
          },
          data:"issueId=" + issueId + "&checksum=" + hashedStr,
          timeout: apiTimeOut,    
          success: function(data, status, xhr) {

              navigator.notification.alert(xhr.responseText, function(){}, "Alert", "Ok");
             window.location.href = "notification.html";
            
          },
          error:function (xhr, ajaxOptions, thrownError){
            
              if(xhr.status==0)
                {
                     navigator.notification.alert(xhr.statusText,function(){}, "Alert", "Ok");
                }
              else
                navigator.notification.alert(xhr.responseText, function(){}, "Alert", "Ok");

              loading.endLoading();
            }
        })

        }
        catch(ex){
             //show error message
        }
}

function storeProfile(data) {
    
        var uid=data.USER_ID;
        var name=data.USER_NAME;
        var email=data.USER_EMAIL;
        var phoneno=data.USER_PHONE;  
        var date=data.DATE_CREATED;
        var staffno=data.STAFF_NO;
        var udesignation= data.USER_DESIGNATION;
        var ulogin=data.USER_LOGIN;
        var ustatus=data.USER_STATUS; 
       
        db.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS UserProfile');
           
            tx.executeSql('CREATE TABLE IF NOT EXISTS UserProfile (UserID text, UserName text, email text, phoneno text, date text, staffno text, Designation text, ulogin text, ustatus text)');

                var profile = {
                values1 : [uid, name, email, phoneno, date, staffno,udesignation,ulogin,ustatus]
                };

                tx.executeSql(
                    'INSERT INTO UserProfile (UserID, UserName, email, phoneno, date, staffno,Designation,ulogin,ustatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                    profile.values1,
                    successLogin,
                    errorLogin
                );
            
        });
    
}


function errorLogin(err){

    navigator.notification.alert("Login failed.", function(){}, "Alert", "Ok");
}

function successLogin(){
     window.location.href = "notification.html";
}

function storeNotification(data){
      
        db.transaction(function(tx) {
            
            tx.executeSql('DROP TABLE IF EXISTS notifylist');
            
            tx.executeSql('CREATE TABLE IF NOT EXISTS notifylist (issueID text, issueDate text, sysName text, sysContact text, sysLoc text, issueSts text, notified text, readSts text, ipAdd text)');
            
          if(data!= null && data.length!=0){
                var len = data.length;
              
                    for(var i=0; i<len; i++)
                    {   
                        var issueID=data[i].ISSUE_ID;
                        var issueDate=data[i].ISSUE_DATE;
                        var sysName=data[i].SYSTEM_NAME;
                        var sysContact=data[i].SYSTEM_CONTACT;  
                        var sysLoc=data[i].SYSTEM_LOCATION;
                        var issueSts=data[i].ISSUE_STATUS;
                        var notified= data[i].NOTIFIED;
                        var readSts=data[i].READ_STATUS;
                        var ipAdd=data[i].IP_ADDRESS; 

                        var notificationData = {
                        values1 : [issueID, issueDate, sysName, sysContact, sysLoc, issueSts,notified,readSts,ipAdd]
                        };

                        tx.executeSql(
                            'INSERT INTO notifylist (issueID, issueDate, sysName, sysContact, sysLoc, issueSts,notified,readSts,ipAdd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                            notificationData.values1,
                            successNotifyLogin,
                            errorNotifyLogin
                        );
                         loading.endLoading();

                    }
          }else{
               navigator.notification.alert("No record at this moment", function(){}, "Alert", "Ok");
          }
         
        });

}


function errorNotifyLogin(err){
    navigator.notification.alert("Login failed", function(){}, "Alert", "Ok");
}

function successNotifyLogin(){
 //on success
}