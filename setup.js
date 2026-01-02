require ('dotenv').config();

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const nodejs_version = process.version;
const USER = process.env.SUDO_USER || process.env.USER || 'nodeuser';
const NODE_PATH = process.execPath;
const si = require('systeminformation');
const os = require('os');
const port = process.env.PORT || 3000;

if (USER === "root") {
    console.error("Do not run this setup script as ROOT/Administrator. Please use a standard user account with sudo privileges.");
    process.exit(1);
}

const service_file = `[Unit]
Description=Server Service for controlling server with http
After=network.target

[Service]
ExecStart=${NODE_PATH} ${path.join(__dirname, 'server.js')}
Restart=always
User=${USER}
Environment=NODE_ENV=production
WorkingDirectory=${__dirname}

[Install]
WantedBy=multi-user.target
`;


function generate_service_file() {
    const service_path = path.join(__dirname, 'server-mobile-manage.service');
    
    fs.writeFileSync(service_path, service_file);
    console.log("Service file created at:", service_path);
}

function execute_install_sh() {
    const script_path = path.join(__dirname, './scripts/install.sh');
    const service_path = path.join(__dirname, 'server-mobile-manage.service');

    if (!fs.existsSync(script_path)) {
        console.error("Installation script not found at:", script_path, "\nPlease run [npm run gen-ins] to generate it first.");
        process.exit(1);
    }

    console.log("\nStarting installation... You may need enter SUDO Password.");
    try {
        execSync(`sudo bash "${script_path}" "${service_path}"`, { stdio: 'inherit' });
        console.log("\nInstallation Successfully. Application is set to run on port", port);
        console.log(`API Docs available at http://localhost:${port}/doc`);
        fs.unlinkSync(script_path); 
    } catch (error) {
        console.error("\nFailed to run installation script, Make sure you have sudo access or the correct password.");
        process.exit(1);
    }
} 

async function setup() {
    const os_info = await si.osInfo();
    const majorVersion = parseInt(nodejs_version.replace('v', '').split('.')[0]);

    console.log("Running On:", os_info.distro, os.type(), os.release(), os.arch());
    console.log("Checking Node.js version...");
    if (!nodejs_version) {
        console.error("Unable to determine Node.js version.");
        console.error("Please ensure Node.js is installed.");
        process.exit(1);
    } else if (majorVersion < 20) {
        console.error(`Node.js version ${nodejs_version} is too old. Please use v20 or higher.`);
        process.exit(1);
    } else {
        console.log(`Node.js Version Check: ${nodejs_version} (OK)`);
        generate_service_file();
        execute_install_sh();
    }
}

module.exports = {
    setup
}