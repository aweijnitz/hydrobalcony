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
	

## Use

### Configuration

#### Application configuration
The main config file is [appConf.json](conf/appConf.json) and it should be more or
less self-explanatory. The most important thing to set up is the tty
device. For development use ```/dev/tty.MockSerial```. There are two
ready-made examples included -
[one for development](conf/appConf.json.dev) and [one for running
on the Pi](conf/appConf.json.pi). Just copy the appropriate one to ```appConf.json``` and you
shouldn't have to worry about anything.

### Pump schedule configuration
When the pump runs and exeptions to the schedule are determined by the
contents of the file [pumpSchedule.json](conf/pumpSchedule.json).
Internally [later.js](http://bunkat.github.io/later/) is used and the
config is just passed along as a
[schedule](http://bunkat.github.io/later/schedules.html) to
```later```.

The file is watched for changes and **the pump schedule is reloaded on the
fly if the file is modified**.

## Endpoints

### Start and stop the pump
There is a simple REST-like API for controlling the pump out of
schedule over HTTP (starting/stopping/status). The endpoint is
```/pump``` and it works like this

- GET, returns JSON with latest known status
- PUT or POST, set pump state (on/off). Returns JSON with status.

As a rudimentary security measure, the API needs to be enabled on the
process by setting the environment variable ```HYDRO_CONTROL``` to
true and a query parameter ```key``` needs to be passed along when
PUT:ing or POST:ing. The key must match the content of the environment
variable ```HYDRO_CONTROL_KEY```.

**Example**
Put this in .bashrc

    export HYDRO_CONTROL=true
    export HYDRO_CONTROL_KEY=myAPIkey

then POST to ```http://[my host]/pump/on?key=[myAPIKey]``` to activate
the pump.

To deactivate the pump, POST to ```http://[my host]/pump/off?key=[myAPIKey]```.

See [startStopÅumpHandler](routes/startStopPumpHandler.js) for details.

### Se upcoming pump schedule

    http://localhost:7878/pumpschedule?count=16

As JSON

    http://localhost:7878/pumpschedule?count=16&format=json


