#!/bin/bash

CODEDIR=/home/hydro/GIT/hydrobalcony/RaspberryPi/ttyDataServer.js

## explicitly source settings file (where environment vars are defined)
## To consider: move CLIACKATELL_AUTH_TOKEN, HYDRO_CONTROL, HYDRO_CONTROL_KEY
## here instead.
. /home/hydro/.bashrc

## to make relative paths work
cd $CODEDIR

## exec, to follow existing thread (service-PID will be accurate). Fire!
exec /usr/local/bin/node $CODEDIR/ttyDataServerMain.js
