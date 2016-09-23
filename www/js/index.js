/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
     bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
        app.initPushNotificationRegister();
        
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    
     initPushNotificationRegister: function(){
         FCMPlugin.getToken(
          function(token){
            alert(token);
          },
          function(err){
            alert('error retrieving token: ' + err);
          }
        )
    
//           navigator.FCMNotification.fcmTokenID(function(tokenID){
//               
//               alert("uuu");
//        // retrun token id for notification service
//        alert("Token ID = " + tokenID);
//        //Token ID use for call notification form FCM server.
//     }, function(error){
//        alert(error);
//     });
//        var pushNotification = window.plugins.pushNotification;
//        
//        
//        if ( device.platform == 'android' || device.platform == 'Android'){
//            pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"227139393233","ecb":"app.onNotificationGCM"});
//        } 
//        else {
//            pushNotification.register(app.tokenHandler,app.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
//        }

    },
    
    // result contains any message sent from the plugin call
    successHandler: function(result) {
//        alert('Callback Success! Result = '+result);
    },
    
    errorHandler:function(error) {
//        alert(error);
    },
    
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
//                $("#redidtxtareas").val(e.regid);
                if ( e.regid.length > 0 )
                {
//                    console.log("Regid " + e.regid);
//                    alert('registration id = '+e.regid);
                    dbmanager.getProfile(function(returnData){
                        if(returnData.rows.length>0){
                            var uid=returnData.rows.item(0).uid;
                            var token=returnData.rows.item(0).token;
                            var regid=e.regid;
                            
                            postRegistrationId(uid, token, regid, "android"); 
                        }    
                    });
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
//              alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;
 
            case 'error':
//              alert('GCM error = '+e.msg);
            break;
 
            default:
//              alert('An unknown GCM event has occurred');
              break;
        }
    },
    
    tokenHandler: function(result) {
        // Your iOS push server needs to know the token before it can push to this device
        // here is where you might want to send it the token for later use.
//        alert('device token = ' + result);
//        $("#redidtxtareas").val(result);
        dbmanager.getProfile(function(returnData){
            if(returnData.rows.length>0){
                var uid=returnData.rows.item(0).uid;
                var token=returnData.rows.item(0).token;
                var regid=result;
                            
                postRegistrationId(uid, token, regid, "ios"); 
            }    
        });
    },
    
    onNotificationAPN: function(event) {
        if ( event.alert )
        {
            navigator.notification.alert(event.alert);
        }

        if ( event.sound )
        {
            var snd = new Media(event.sound);
            snd.play();
        }

        if ( event.badge )
        {
            pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
        }
    }
    
    
};
