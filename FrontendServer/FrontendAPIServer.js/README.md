# FrontendAPIServer.js
An Express4 server that subscribes to the websockets events emitted from 
the [ttyDataServer](https://github.com/aweijnitz/hydrobalcony/tree/master/RaspberryPi/ttyDataServer.js) and processes them.

Exposes API for sensor data and emits websocket events.

## Install
	sudo npm install
## Run
	npm start
## Run tests
	npm test

## HTTP API
There is a small REST-like API to get the latest data.

### Note on sensor readings
As data comes in, it is cached in RAM. Cached data will normally be available for all sensors, 
but it can be missing for a few minutes directly following a restart of the service. 

**API: Get latest value for sensor**

GET http://HOST/latest/sensorname yields the latest value for the sensor 

**Example response**

```{"name":"airTemp","value":23.12,"raw":"2312","timestamp":"2015-06-05T20:35:09.158Z","unit":"C"}```

**Examples:**

- http://localhost:7979/latest/airTemp

- http://localhost:7979/latest/waterTemp

- http://localhost:7979/latest/waterLevel

- http://localhost:7979/latest/pumpCurrent

- http://localhost:7979/latest/airPressure

- http://localhost:7979/latest/lightLevel

**API: Get all sensora data during a specified time interval or duration**

GET http://HOST/sensordata/sensorname?from=fromDate&to=toDate


## WebSocket events
In addition to the REST-like API, there are push-based events being emitted using [socket.io](http://socket.io/)
as data comes in.

There are two kinds of events

```data``` - emitted as sensor data comes in. The payload is a JSON object with the sensor reading.
 
```pump``` - emitted as the pump activates and deactivates. The payload is a JSON object with the pump state.
 
**Example use**

    var host = 'http://hydro.weekendhack.it'; 
    var opts = {path: '/dashboard/socket.io'};
    var socket = io.connect(host, opts);
    socket.on('data', function (data) {
      console.log(data);
    });



**Server startup**
	
<img src="http://mildly-interesting.info/images/startShutown.png" alt="Server startup" style="width:640px;">	


## Datastore: RethinkDB

All sensor data is stored as JSON objects in a a RethinkDB database. All, but the most basic queries are relatively
slow and therefore run out-of-process to keep the server responsive. Typically these slow queries are for buidling 
timeline graphs for sensor data.

### Installing a RethinkDB command line client
	sudo npm install -g recli
	recli (then something like: r.db('hydro').table('sensordata').count())
	
### Useful DB queries

#### Create an index for timestamps

    r.db('hydro').table('sensordata').indexCreate('timestamp')

#### Basic select for graph data (slow)

    r.db('hydro').table('sensordata').filter(r.row('name').eq('waterTemp')).orderBy('timestamp').limit(10).pluck('name','timestamp','value')

#### Select latest 10 elements, sorting using index created above

    r.db('hydro').table('sensordata').orderBy({index: r.desc('timestamp')}).filter(r.row('name').eq('waterTemp')).limit(10).pluck('timestamp','value')

### Useful db queries

#### Ordered list of temperatures for the last week (604800 = 7 * 24 * 60 * 60)
    r.db('hydro').table('sensordata').orderBy({index: r.desc('timestamp')}).filter(r.row('timestamp').during(r.now().add(-604800), r.now()).and(r.row('name').eq('airTemp'))).pluck(['timestamp','value'])

*Note:* Needs an index on the property to sort by

#### Get max air temperatures grouped by month
    r.db('hydro').table('sensordata').filter(r.row('name').eq('airTemp')).group(r.row('timestamp').month()).max('value').pluck(['timestamp','value'])

### Get avergage air temperature last 24h

    r.db('hydro').table('sensordata').orderBy({index: r.desc('timestamp')}).filter(r.row('timestamp').during(r.now().add(-1*24*60*60), r.now()).and(r.row('name').eq('airTemp'))).group(r.row('timestamp').hours()).avg('value')

#### Get max water temperatures grouped by month
    r.db('hydro').table('sensordata').filter(r.row('name').eq('waterTemp')).group(r.row('timestamp').month()).max('value').pluck(['timestamp','value'])

#### Min and max waterLevel ever recorded
    r.db('hydro').table('sensordata').filter(r.row('timestamp').month().eq(5).and(r.row('name').eq('waterLevel'))).min('value').pluck(['timestamp','value'])

    r.db('hydro').table('sensordata').filter(r.row('timestamp').month().eq(5).and(r.row('name').eq('waterLevel'))).max('value').pluck(['timestamp','value'])

#### Min and max air temp ever recorded
    r.db('hydro').table('sensordata').filter(r.row('timestamp').month().eq(5).and(r.row('name').eq('airTemp'))).min('value').pluck(['timestamp','value'])

    r.db('hydro').table('sensordata').filter(r.row('timestamp').month().eq(5).and(r.row('name').eq('airTemp'))).max('value').pluck(['timestamp','value'])

#### Get air temeratures in May
    r.db('hydro').table('sensordata').filter(r.row('timestamp').month().eq(5).and(r.row('name').eq('airTemp'))).pluck(['timestamp','value'])

#### Get max air temperature recorded in May
    r.db('hydro').table('sensordata').filter(r.row('timestamp').month().eq(5).and(r.row('name').eq('airTemp'))).max('value').pluck(['timestamp','value'])

    r.db('hydro').table('sensordata').filter(r.row('timestamp').month().eq(5).and(r.row('name').eq('airTemp'))).min('value').pluck(['timestamp','value'])


#### Get max and min water temperature recorded in May
    r.db('hydro').table('sensordata').filter(r.row('timestamp').month().eq(5).and(r.row('name').eq('waterTemp'))).max('value').pluck(['timestamp','value'])

    r.db('hydro').table('sensordata').filter(r.row('timestamp').month().eq(5).and(r.row('name').eq('waterTemp'))).min('value').pluck(['timestamp','value'])

	
