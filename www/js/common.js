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
            
            tx.executeSql("SELECT * FROM UserProfile", [], function(tx, rs){
                returnData(rs);
          }, this.errorExecuteSQL);
        });
         
    },
    
    //select notfication data
    getNotifyListData:function(returnData){
        db.transaction(function(tx){
           tx.executeSql('SELECT * FROM NotificationList', [], function(tx, rs){
              
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
             $('#dtdetail').html(setDetailDateFormat(returnData.rows.item(pageNum).issueDate));
             $('#ipdetail').html(returnData.rows.item(pageNum).IpAdress);
             $('#sysdetail').html(returnData.rows.item(pageNum).SystemName);
             $('#syscondetail').html(returnData.rows.item(pageNum).SystemContact);
             $('#syslcdetail').html(returnData.rows.item(pageNum).SystemLocation);
             $('#stsdetail').html(returnData.rows.item(pageNum).IssueStatus);
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
    