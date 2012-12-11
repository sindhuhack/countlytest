##What's Countly?
Countly is an innovative, real-time, open source mobile analytics application. It 
collects data from mobile phones, tablets and other internet-connected devices, 
and visualizes this information to analyze mobile application usage and end-user behavior. 
There are two parts of Countly: the server that collects and analyzes data, and mobile SDK 
that sends this data.

Which mobile operating systems does Countly support? 

Countly supports top-notch devices, including iOS, Android, Windows Phone and Blackberry. 
Below you can find Countly SDK repositories. Each SDK has its own installation instructions.

- [Countly Android SDK](https://github.com/Countly/countly-sdk-android)
- [Countly iOS SDK](https://github.com/Countly/countly-sdk-ios)
- [Countly Windows Phone SDK](https://github.com/Countly/countly-sdk-windows-phone)
- [Countly Blackberry Webworks SDK](https://github.com/Countly/countly-sdk-blackberry-webworks)

##How do I install Countly server?

We provide a beautiful installation sript (`bin/countly.install.sh`) with countly-server package that installs and configures everything required to run Countly Server.

If you feel like doing things manually you can take a look at the installation articles from [http://support.count.ly](http://support.count.ly "Countly Support").

##Dependencies
We develop and test Countly on Ubuntu with MongoDB, Node.js and nginx. It should work in your Linux distribution (e.g Fedora, OpenSUSE, etc), however, you need to install them by hand.

##How do I upgrade my Countly server?

countly-server package includes an upgrade script (`bin/countly.upgrade.sh`) that takes care of the upgrade process. [See this tutorial](http://support.count.ly/kb/web-installation/upgrading-countly-server-to-v1209-from-v1208) if you would like to perform the upgrade manually (12.08 to 12.09).

##API & Frontend

Quick overview of some important files and directories included in this package;

####1. frontend/express/app.js

Countly dashboard that runs on Express server.

####2. frontend/express/public/javascripts/countly
Contains seperate  helper js files for each data visualization. For example `countly.session.js` is responsible for calculating session related metrics and interacts with `api/api.js` to retrieve data from the sessions collection.

####3. api/api.js

Countly write and read API. Waits for write requests from the mobile SDKs and read requests from the 
Countly js helpers. Refer to [Countly Server API Reference](https://github.com/Countly/countly-server/wiki/Countly-Server-API-Reference) for details.

##Which mobile operating systems are supported?
Countly offers integration with world's leading mobile operating systems: Android, iOS, Windows Phone and Blackberry.

##How can I help you with your efforts?
Glad you asked. We need ideas, feedbacks and constructive comments. All your suggestions will be taken care with upmost importance. 

We are on [Twitter](http://twitter.com/gocountly) and [Facebook](http://www.facebook.com/Countly) if you would like to keep up with our fast progress!

##Home

[http://count.ly](http://count.ly "Countly")

##Community & support

[http://support.count.ly](http://support.count.ly "Countly Support")

##Rebranding

Ask us (hello@count.ly) if you want to whitelabel Countly and we'll be glad to help.