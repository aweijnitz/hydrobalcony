# Monitoring 
Collection of scripts used to check system health and to send SMS alerts when something happens.
The [Clickatell SMS Gateway](https://www.clickatell.com/apis-scripts/apis/rest/) is used to send SMS:s.


**Crontab entries**

    */3 * * * * /projects/Hydrobalcony/hydrobalcony/FrontendServer/monitor/isFrontendUp.js
    */2 * * * * /projects/Hydrobalcony/hydrobalcony/FrontendServer/monitor/checkWaterLevel.js
    
**Monitoring URLs**

[DB Status](http://hydro.weekendhack.it/status/ok.html)

[Water Level Status](http://hydro.weekendhack.it/status/waterLevelOk.html)
