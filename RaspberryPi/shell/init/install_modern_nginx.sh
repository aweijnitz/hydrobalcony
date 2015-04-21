#!/bin/bash

## INSTALL MODERN NGNX 
# From: https://mattwilcox.net/web-development/setting-up-a-secure-website-with-https-and-spdy-support-under-nginx-on-a-raspberry-pi
#
# Run this script with sudo bash -c ./install_modern_nginx.sh

# Make temporary build dir
mkdir nginxBuild
cd nginxBuild

sudo apt-get -y update
sudo apt-get -y install nginx
sudo apt-get -y remove nginx

# Fetch pre-cooked shell script
wget https://gist.githubusercontent.com/MattWilcox/402e2e8aa2e1c132ee24/raw/3423f9c311e63c67ee5370431a1a34f92664203d/build_nginx.sh
sudo chmod +x ./build_nginx.sh
sudo ./build_nginx.sh

# Exit dir and clean up
cd ..
#rm -rf nginxBuild

sudo apt-get -y autoremove

echo "DONE"
