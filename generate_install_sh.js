const fs = require('fs');
const path = require('path');
const script_dir = path.join(__dirname, 'scripts/');
const install_sh_path = path.join(script_dir, 'install.sh');
const install_sh_content = `#!/bin/bash
SERVICE_FILE_PATH="$1"
APP_USER=$SUDO_USER
COMMAND="/sbin/shutdown, /sbin/reboot, /usr/bin/systemctl restart nginx, /usr/bin/systemctl is-active nginx, /usr/bin/systemctl restart jellyfin, /usr/bin/systemctl is-active jellyfin"
SERVICE_NAME="server-mobile-manage.service"
SUDOERS_CONFIG="/etc/sudoers.d/server-mobile-manage-config"

echo "SETUP SCRIPT"

if sudo systemctl is-enabled "$SERVICE_NAME" >/dev/null 2>&1; then
    echo "Service $SERVICE_NAME is already enabled."

    if sudo grep -q "/sbin/shutdown" "$SUDOERS_CONFIG"; then
        echo "Sudoers configuration verified."
    else
        echo "WARNING: Sudoers config found but commands are incorrect or missing. Reinstalling."
    fi
    if [ -f "/etc/systemd/system/$SERVICE_NAME" ]; then
        if sudo cmp --silent "$SERVICE_FILE_PATH" "/etc/systemd/system/$SERVICE_NAME"; then
            echo "Service file content is correct. Installation skipped."
            exit 0
        else
            echo "WARNING: Service file found but content differs. Reinstalling."
        fi
    fi

fi

echo "Configuration sudoers for user: \${APP_USER}..."
echo "Defaults:\${APP_USER} !requiretty" | sudo tee /etc/sudoers.d/server-mobile-manage-config > /dev/null
echo "\${APP_USER} ALL=(ALL) NOPASSWD: \${COMMAND}" | sudo tee -a /etc/sudoers.d/server-mobile-manage-config > /dev/null

echo "Copy file service to /etc/systemd/system/server-mobile-manage.service"
sudo cp "$SERVICE_FILE_PATH" /etc/systemd/system/server-mobile-manage.service

echo "Start Service..."
sudo systemctl daemon-reload
sudo systemctl enable server-mobile-manage.service
sudo systemctl start server-mobile-manage.service
echo "Setup Success, Service has been enabled"`;


function generate_install_script() {
    if (fs.existsSync(install_sh_path)) {
        console.log("Installation script already exists at:", install_sh_path);
        process.exit(1);
    }

    fs.mkdirSync(script_dir, { recursive: true });
    fs.writeFileSync(install_sh_path, install_sh_content, { mode: 0o755 });
    console.log("Installation script created at:", install_sh_path);
}

generate_install_script();