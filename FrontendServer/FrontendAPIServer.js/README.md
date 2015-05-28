# FrontendAPIServer.js
An Express4 server that subscribes to the websockets events emitted from the [ttyDataServer](https://github.com/aweijnitz/hydrobalcony/tree/master/RaspberryPi/ttyDataServer.js) and processes them.


## Install
	sudo npm install
## Run
	npm start
## Run tests
	npm test

## Query RethinkDB
	sudo npm install -g recli
	recli (then something like: r.db('hydro').table('sensordata').count())
	
### Notes for DB queries

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


	
<img src="http://mildly-interesting.info/images/startShutown.png" alt="Server startup" style="width:640px;">	
	
