# ttyDataServer.js
An Express4 server reading data from serial port (a tty) and relaying them as socket.io events

Features

- Application life-cycle management
    * Pre-start setup hook
    * Shutdown hook on 'SIGINT' and 'SIGTERM' for pre-exit cleanup or data saving.
- Logging using [log4js](https://github.com/nomiddlename/log4js-node)
    * Config includes both rotating file and console logging
- Application config injection
    * Simple pattern for injecting config and logger info in modules (see `routes/history.js` for example)
- Built in form parsing with Formidable
    * Example includes file upload form
- Example test cases 
    * Using [Mocha](http://visionmedia.github.io/mocha/) and [Should](https://github.com/visionmedia/should.js/)

## Install
    mkdir logs
    mkdir uploadDir
	npm install
## Run
	npm start
## Run tests
	npm test
	
<img src="http://mildly-interesting.info/images/startShutown.png" alt="Server startup" style="width:640px;">	
	
