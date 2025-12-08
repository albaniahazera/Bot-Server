#!/bin/bash

SERVICE_FILE_PATH="$1"
APP_USER=$SUDO_USER
COMMAND="/sbin/shutdown, /sbin/reboot, /usr/bin/systemctl restart nginx, /usr/bin/systemctl is-active nginx, /usr/bin/systemctl restart jellyfin, /usr/bin/systemctl is-active jellyfin"

echo "SETUP SCRIPT"
echo "Configuration sudoers for user: ${APP_USER}..."
echo "Defaults:${APP_USER} !requiretty" | sudo tee /etc/sudoers.d/bot-server-config > /dev/null
echo "${APP_USER} ALL=(ALL) NOPASSWD: ${COMMAND}" | sudo tee -a /etc/sudoers.d/bot-server-config > /dev/null
echo "Copy file service to /etc/systemd/system/bot-server.service"
sudo cp "$SERVICE_FILE_PATH" /etc/systemd/system/bot-server.service

echo "Start Service..."
sudo systemctl daemon-reload
sudo systemctl enable bot-server.service
sudo systemctl start bot-server.service
echo "Setup Success, Service has been enabled"