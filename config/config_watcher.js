const fs = require('fs');
const path = require('path');
const config = require('./config');
const CONFIG_PATH = path.join(__dirname, './service.conf');

function start_watcher() {
    console.log('Starting config watcher for', CONFIG_PATH);

    fs.watchFile(CONFIG_PATH, (curr, prev) => {
        if (curr.mtime.getTime() !== prev.mtime.getTime()) {
            console.log('Configuration file changed, reloading...');
            config.reloadConfig();
        }
    })
};

module.exports = {
    start_watcher
}