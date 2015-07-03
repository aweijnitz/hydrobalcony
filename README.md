# Hydrouino Dream Garden
Hydroponic control and monitoring for single pump NFT system.

## Structure of this code repository
This is the main repository for my hydroponic balcony garden. As can be seen in the figure below, it is 
divided into three distinct parts, each representing an area of functionality. The structure of the respository
directly reflects these areas of concern and the folder naming hints at what code goes on what device.

### Three target devices
There are three target devices involved in the full deployment and there is a folder for each. In the device folders,
there are sub-projects/folders for different parts of functionality.

**Arduino:**

The code is a regular sketch for the Arduino IDE. Bitlash is used to enable on-the-fy updates of configuration parameter.

**Raspberry Pi:** 

A Raspberry Pi is used to collect data and forward sensor data, control the pump and it also controls a webcam
that is used to take pictures at regular intervals. The main codebase is written in Node.js, but there are also some
shell-scripts, as well as the Bitlash-config. The bitlash scripts are currently stored on the 
Raspberry Pi and therefore not part of the Arduino folder, although you could argue that they belong in there.

**Virtual Private Server ("cloud server")**

A Virtual Private Server (VPS) is used to store the collected data (over a million data points already!). It also 
provides the Dashboard UI and exposes a REST-like API to read sensor data. The VPS also takes care of 
[monitoring](https://github.com/aweijnitz/hydrobalcony/tree/master/FrontendServer/monitor) and 
sending alarms over SMS through the [Clickatell](https://www.clickatell.com/apis-scripts/apis/rest/) SMS Gateway if 
some critical condition is met, like the water level being very low.

## The setup/BOM

- 2*120cm PVC pipe + bends and fittings
- 60L capcaity tank with about 25L nutrient water.
- 4*2 plants for 7 chilis, 1 tomato (all chilis seeded in Rockwool)
- Method: [Nutrient Film Technique](http://en.wikipedia.org/wiki/Nutrient_film_technique)
- [Pump schedule](https://github.com/aweijnitz/hydrobalcony/blob/master/RaspberryPi/ttyDataServer.js/conf/pumpSchedule.json): 
Currently five runs per hour, 40 seconds per run (the pump is a bit too powerful for the job. Shoudl ideally run continously)
  
### Medium And Nutrients
- Medium: Rockwool (tomato plant in Coco)
- Nutrients: [Cellmax Hydro Grow ](http://www.hydroponics.eu/nutrients-and-additives-c-20/cellmax-s-25/cellmax-hydro-grow-2x1l-soft-water-1669.html) Two component solution mixed X+Y equal parts, 2ml/l (50% of recommended strength).

## Homepage and Dashboard

- [Homepage](http://hydro.weekendhack.it)
- [Hydro Dashboard](http://hydro.weekendhack.it/dashboard)

## The Rig
![The rig](http://i.imgur.com/T3ySmOS.jpg)
 
# Sensors and controls
![sensors](https://docs.google.com/drawings/d/187NUvv8yzl_EJaqOleSDgmZCu7S9VLZEXMUmve4C4P4/pub?w=960&amp;h=720)

# System overview
![system overview](https://docs.google.com/drawings/d/1WWvZ8wsWjwgq-hmj79UxCswE7FLGIlY8i4sA85JrOd0/pub?w=960&amp;h=720")

