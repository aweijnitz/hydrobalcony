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
	
<img src="http://mildly-interesting.info/images/startShutown.png" alt="Server startup" style="width:640px;">	
	