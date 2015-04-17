#!/bin/bash

sudo apt-get update
sudo apt-get upgrade -y

# install node.js (io.js requires jessie at this point. I won't bother)
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb

# Enable access to GPIO for user pi
# from https://learn.adafruit.com/node-embedded-development/installing-node-dot-js
git clone git://github.com/quick2wire/quick2wire-gpio-admin.git ~/gpio-admin && cd ~/gpio-admin
make
sudo make install
sudo adduser pi gpio

# Example: Make pin 17 avaiable for use in Node.js
# gpio-admin export 17
# See more https://learn.adafruit.com/node-embedded-development/events

#
# SSH blacklist known bad guys
#
sudo apt-get install -y openssh-blacklist

#
# ____ Install fail2ban - limit connection attemps, then block
#
sudo apt-get install -y fail2ban

# Local config
sudo cat /etc/fail2ban/jail.conf | sed 's/root@localhost/anders.weijnitz@gmail.com/g' > /tmp/jail.local
sudo cp /tmp/jail.local /etc/fail2ban/jail.local

# Start fail2ban
sudo service fail2ban restart


#
# Finally make sure it has all the latest patches
#
sudo apt-get -y upgrade


