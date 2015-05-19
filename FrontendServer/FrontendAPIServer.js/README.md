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

- Create an index for timestamps

	r.db('hydro').table('sensordata').indexCreate('timestamp')

- Basic select for graph data (slow)

	r.db('hydro').table('sensordata').filter(r.row('name').eq('waterTemp')).orderBy('timestamp').limit(10).pluck('name','timestamp','value')

- Select latest 10 elements, sorting using index created above

	r.db('hydro').table('sensordata').orderBy({index: r.desc('timestamp')}).filter(r.row('name').eq('waterTemp')).limit(10).pluck('timestamp','value')



### Useful db queries

#### Get max air temperatures grouped by month
    r.db('hydro').table('sensordata').filter(r.row('name').eq('airTemp')).group(r.row('timestampraw').month()).max('value').pluck(['timestampraw','value'])

#### Get max water temperatures grouped by month
    r.db('hydro').table('sensordata').filter(r.row('name').eq('waterTemp')).group(r.row('timestampraw').month()).max('value').pluck(['timestampraw','value'])

#### Min and max waterLevel ever recorded
    r.db('hydro').table('sensordata').filter(r.row('timestampraw').month().eq(5).and(r.row('name').eq('waterLevel'))).min('value').pluck(['timestampraw','value'])

    r.db('hydro').table('sensordata').filter(r.row('timestampraw').month().eq(5).and(r.row('name').eq('waterLevel'))).max('value').pluck(['timestampraw','value'])

#### Min and max air temp ever recorded
    r.db('hydro').table('sensordata').filter(r.row('timestampraw').month().eq(5).and(r.row('name').eq('airTemp'))).min('value').pluck(['timestampraw','value'])

    r.db('hydro').table('sensordata').filter(r.row('timestampraw').month().eq(5).and(r.row('name').eq('airTemp'))).max('value').pluck(['timestampraw','value'])

#### Get air temeratures in May
    r.db('hydro').table('sensordata').filter(r.row('timestampraw').month().eq(5).and(r.row('name').eq('airTemp'))).pluck(['timestampraw','value'])

#### Get max air temperature recorded in May
    r.db('hydro').table('sensordata').filter(r.row('timestampraw').month().eq(5).and(r.row('name').eq('airTemp'))).max('value').pluck(['timestampraw','value'])

    r.db('hydro').table('sensordata').filter(r.row('timestampraw').month().eq(5).and(r.row('name').eq('airTemp'))).min('value').pluck(['timestampraw','value'])


#### Get max and min water temperature recorded in May
    r.db('hydro').table('sensordata').filter(r.row('timestampraw').month().eq(5).and(r.row('name').eq('waterTemp'))).max('value').pluck(['timestampraw','value'])

    r.db('hydro').table('sensordata').filter(r.row('timestampraw').month().eq(5).and(r.row('name').eq('waterTemp'))).min('value').pluck(['timestampraw','value'])


	
<img src="http://mildly-interesting.info/images/startShutown.png" alt="Server startup" style="width:640px;">	
	
