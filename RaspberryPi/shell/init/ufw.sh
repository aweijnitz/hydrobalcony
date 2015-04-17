#!/bin/bash

#
# ____ Install Uncomplicated Firewall (frontend to iptables)
#
sudo apt-get install -y ufw
# Be paranoid
sudo ufw disable
# Deny all connections
sudo ufw default deny incoming
# Allow ssh Note: If ssh is on another port, use 'sudo ufw allow 2222/tcp' for port 2222
sudo ufw allow ssh
# Allow web traffic (same as sudo ufw allow 80/tcp)
sudo ufw allow www
# Activate firewall Manual status check: sudo ufw status, or sudo ufw status verbose Turn firewall off: sudo ufw 
# disable
sudo ufw --force enable
