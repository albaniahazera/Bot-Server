const { execSync } = require('child_process');

const fs = require('fs');
const path = require('path');

function uninstall() {
    const script_path = path.join(__dirname, './scripts/uninstall.sh');

    console.log("\nStarting uninstallation... You may need enter SUDO Password.");
    try {
        execSync(`sudo bash "${script_path}"`, { stdio: 'inherit' });
        console.log("\nUninstallation Successfully. All configurations have been removed.");

        const service_path = path.join(__dirname, 'server-mobile-manage.service');

        if (fs.existsSync(service_path)) {
            fs.unlinkSync(service_path);
            console.log("Local service file removed:", service_path);
        }
    }catch (error) {
        console.error('Error during uninstallation:', error.message);
        process.exit(1);
    }
}

uninstall();