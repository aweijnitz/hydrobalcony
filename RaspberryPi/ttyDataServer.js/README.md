# ttyDataServer.js
An Express4 server reading Arduino sensor data from serial port (a tty) and relaying them as socket.io events to subscribers.

**Overview**

- Reads incoming data from serial port (Arduino on USB) and emits them as processed websocket events using [socket.io](http://socket.io/)
- Exposes REST API for retrieving the raw event log and getting the latest recoreded data


**General server features**

- Application life-cycle management
    * Pre-start setup hook
    * Shutdown hook on 'SIGINT' and 'SIGTERM' for pre-exit cleanup or data saving.
- Logging using [log4js](https://github.com/nomiddlename/log4js-node)
    * Config includes both rotating file and console logging
- Application config injection
    * Simple pattern for injecting config and logger info in modules (see `routes/rawlog` for example)
- Example test cases 
    * Using [Mocha](http://visionmedia.github.io/mocha/) and [Should](https://github.com/visionmedia/should.js/)

## Install
	npm install
## Run
	npm start
## Run tests
	npm test
	
![Startup sequence](https://raw.github.com/aweijnitz/hydrobalcony/master/RaspberryPi/ttyDataServer.js/doc/ttyDataServer_startup.png)
	
