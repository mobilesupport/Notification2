var apiTimeOut = 20000;
var count = 0;
var datacount = 0;
var sha1Key = 8345627;
var registrationId = 123;

function requestLogin(username, password){

        $.ajax({
      url: "http://192.168.1.19/notification_api",
      type: "GET",  
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      timeout: apiTimeOut,  
      success: function(data, status, xhr) {
        
          var sessionToken=JSON.stringify(data);
        postLogin(sessionToken, username, password);
      },
         
      error:function (xhr, ajaxOptions, thrownError){
           loading.endLoading();
           navigator.notification.alert("API connection failed.", function(){}, "Alert", "Ok");
          
        }
    }) 
    
}

function postLogin(token, username, password){
    
    var requestUrl="http://192.168.1.19/notification_api/api/user/login";
    var valueStr=username+password+registrationId+sha1Key;
    var hashedStr=SHA1(valueStr);
    
    try{
        $.ajax({
      url: requestUrl,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:"loginId=" + username + "&password="+password+"&registrationId="+ registrationId + "&checksum=" + hashedStr,
      timeout: apiTimeOut,    
      success: function(data, status, xhr) {
               var uid=data.USER_ID;
             postNotification(uid);
          
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
        
        alert(ex.message);
    }
}

function postNotification(accessId){
    
    var requestUrl="http://192.168.1.19/notification_api/api/notification/PostNotification";
    var valueStr=accessId+sha1Key;
    var hashedStr=SHA1(valueStr);
    
    try{
        $.ajax({
      url: requestUrl,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:"accessId=" + accessId + "&checksum=" + hashedStr,
      timeout: apiTimeOut,    
      success: function(data, status, xhr) {
          
           var uid=data.USER_ID;
        var name=data.USER_NAME;
        var email=data.USER_EMAIL;
        var phoneno=data.USER_PHONE;  
        var date=data.DATE_CREATED;
        var staffno=data.STAFF_NO;
        var udesignation= data.USER_DESIGNATION;
        var ulogin=data.USER_LOGIN;
        var ustatus=data.USER_STATUS; 
          
        storeNotification(data);
          storeProfile(uid, name, email, phoneno, date, staffno,udesignation,ulogin,ustatus);
      },
      error:function (xhr, ajaxOptions, thrownError){
          if(xhr.status==0)
            {}
          else
            navigator.notification.alert("Data retrieved error", function(){}, "Alert", "Ok");
          
          loading.endLoading();
        }
    })
        
    }
    catch(ex){
        
        alert(ex.message);
    }
}

function postLogout(accessId)
{

    var requestUrl="http://192.168.1.19/notification_api/api/logout/logout";
    var valueStr=accessId+sha1Key;
    var hashedStr=SHA1(valueStr);

       try{
            $.ajax({
          url: requestUrl,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
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
                {}
              else
                navigator.notification.alert("Log out unsucessfully", function(){}, "Alert", "Ok");

              loading.endLoading();
            }
        })

        }
        catch(ex){

            alert(ex.message);
        }
}

function storeNotification(data){
      
        db.transaction(function(tx) {
            
            tx.executeSql('DROP TABLE IF EXISTS notifylist');
            
            tx.executeSql('CREATE TABLE IF NOT EXISTS notifylist (issueID text, issueDate text, sysName text, sysContact text, sysLoc text, issueSts text, notified text, readSts text, ipAdd text)');
            
//            tx.executeSql('DELETE FROM notifylist');
                       
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
           
                
            }
             loading.endLoading();
                        
        });

}


function errorNotifyLogin(err){
    navigator.notification.alert("Store error", function(){}, "Alert", "Ok");
}

function successNotifyLogin(){}

function storeProfile(uid, name, email, phoneno, date, staffno,udesignation,ulogin,ustatus) {
    
    var profile = {
    values1 : [uid, name, email, phoneno, date, staffno,udesignation,ulogin,ustatus]
    };
    
    insertProfile(profile);
    
    function insertProfile(profile) {
        db.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS userprofile');
        
            tx.executeSql('CREATE TABLE IF NOT EXISTS userprofile (uid text, name text, email text, phoneno text, date text, staffno text, udesignation text, ulogin text, ustatus text)');
//            tx.executeSql('DELETE FROM userprofile');
            tx.executeSql(
                'INSERT INTO userprofile (uid, name, email, phoneno, date, staffno,udesignation,ulogin,ustatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                profile.values1,
                successLogin,
                errorLogin
            );
        });
    }
    
}


function errorLogin(err){

    navigator.notification.alert("Login failed.", function(){}, "Alert", "Ok");
    loading.endLoading();
}

function successLogin(){
   
    loading.endLoading();
    window.location="notification.html";
}

//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
// Sha1 encryption //
function SHA1(msg) {
  function rotate_left(n,s) {
    var t4 = ( n<<s ) | (n>>>(32-s));
    return t4;
  };
  function lsb_hex(val) {
    var str="";
    var i;
    var vh;
    var vl;
    for( i=0; i<=6; i+=2 ) {
      vh = (val>>>(i*4+4))&0x0f;
      vl = (val>>>(i*4))&0x0f;
      str += vh.toString(16) + vl.toString(16);
    }
    return str;
  };
  function cvt_hex(val) {
    var str="";
    var i;
    var v;
    for( i=7; i>=0; i-- ) {
      v = (val>>>(i*4))&0x0f;
      str += v.toString(16);
    }
    return str;
  };
  function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  };
  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xEFCDAB89;
  var H2 = 0x98BADCFE;
  var H3 = 0x10325476;
  var H4 = 0xC3D2E1F0;
  var A, B, C, D, E;
  var temp;
  msg = Utf8Encode(msg);
  var msg_len = msg.length;
  var word_array = new Array();
  for( i=0; i<msg_len-3; i+=4 ) {
    j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
    msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
    word_array.push( j );
  }
  switch( msg_len % 4 ) {
    case 0:
      i = 0x080000000;
    break;
    case 1:
      i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
    break;
    case 2:
      i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
    break;
    case 3:
      i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8  | 0x80;
    break;
  }
  word_array.push( i );
  while( (word_array.length % 16) != 14 ) word_array.push( 0 );
  word_array.push( msg_len>>>29 );
  word_array.push( (msg_len<<3)&0x0ffffffff );
  for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
    for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
    for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;
    for( i= 0; i<=19; i++ ) {
      temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
    for( i=20; i<=39; i++ ) {
      temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
    for( i=40; i<=59; i++ ) {
      temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
    for( i=60; i<=79; i++ ) {
      temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }
  var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

  return temp.toLowerCase();
}