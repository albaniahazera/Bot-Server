const fs = require('fs');
const path = require('path');
const CONFIG_PATH = path.join(__dirname, './service.conf');
let serviceConfig = {};

function load_config() {
    try {
        const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
        const newconfig = {};
        
        data.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const part = trimmedLine.split(':');
                if (part.length >= 2) {
                    const key = part[0].trim();
                    const value = part.slice(1).join(':').trim().toLowerCase();
                    newconfig[key] = (value === 'true');
                }
            }
        });
        serviceConfig = newconfig;
        console.log('Config loaded successfully:', serviceConfig);
    }catch (error) {
        console.warn('Could not read service configuration file:', error, 'using default settings.');
        serviceConfig = {
            shutdown: true,
            restart: true,
            server_status: true
        };
    }
}

load_config();

module.exports = {
    getConfig: () => serviceConfig,
    reloadConfig: load_config
}