cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-x-socialsharing/www/SocialSharing.js",
        "id": "cordova-plugin-x-socialsharing.SocialSharing",
        "pluginId": "cordova-plugin-x-socialsharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    },
    {
        "file": "plugins/Cordova-Plugin-FCMNotification/www/FCMNotificationPlugin.js",
        "id": "Cordova-Plugin-FCMNotification.CDVPushyMe",
        "pluginId": "Cordova-Plugin-FCMNotification",
        "clobbers": [
            "navigator.FCMNotification"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2",
    "cordova-plugin-x-socialsharing": "5.1.3",
    "Cordova-Plugin-FCMNotification": "1.0.0-dev"
}
// BOTTOM OF METADATA
});