#!/bin/bash

CODEDIR=/home/aw/projects/Hydrobalcony/hydrobalcony/FrontendServer/FrontendAPIServer.js

## explicitly source settings file (where environment vars are defined)
## To consider: move CLIACKATELL_AUTH_TOKEN, HYDRO_CONTROL, HYDRO_CONTROL_KEY
## here instead.
. /home/aw/projects/Hydrobalcony/apiKeys.sh

## to make relative paths work
cd $CODEDIR

## exec, to follow existing thread (service-PID will be accurate). Fire!
exec /usr/bin/node $CODEDIR/FrontendAPIServer.js
