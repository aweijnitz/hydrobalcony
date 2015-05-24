# Monitoring 
Collection of scripts used to check system health and to send SMS alerts when something happens.

**Crontab entries**

    */3 * * * * /projects/Hydrobalcony/hydrobalcony/FrontendServer/monitor/isFrontendUp.js
    */2 * * * * /projects/Hydrobalcony/hydrobalcony/FrontendServer/monitor/checkWaterLevel.js
