const { execSync, spawn } = require('child_process');

exports.shutdown_system = (async (req, res) => {
    try {
        execSync('sudo shutdown now');
        res.json({ message: 'System is shutting down' });
    } catch (error) {
        console.error("Shutdown failed:", error.message);
        res.status(500).json({ error: 'Failed to shutdown system' });
    }
});

exports.restart_system = (async (req, res) => {
    try {
        execSync('sudo reboot');
        res.json({ message: 'System is restarting' });
    }catch (error) {
        console.error("Reboot failed:", error.message);
        res.status(500).json({ error: 'Failed to restart system' });
    }
});

exports.restart_jellyfin = (async (req, res) => {
    try {
        execSync('sudo systemctl restart jellyfin');
        res.json({ message: 'Jellyfin is restarting' });
    }catch (error) {
        console.error("Jellyfin restart failed:", error.message);
        res.status(500).json({ error: 'Failed to restart jellyfin' });
    }
});

exports.status_jellyfin = (async (req, res) => {
    const command = 'systemctl';
    const args = ['status', 'jellyfin'];
    let output = "";
    let err_output = "";
    let responseSent = false; 

    const sendResponse = (statusCode, success, message, details) => {
        if (responseSent) {
            console.warn('Attempted to send response twice, blocked.');
            return;
        }
        responseSent = true;
        res.status(statusCode).json({
            success: success,
            message: message,
            details: details,
            service_name: 'jellyfin'
        });
    };

    const statusProcess = spawn(command, args);

    statusProcess.stdout.on('data', (data) => {
        output += data.toString();
    });
    statusProcess.stderr.on('data', (data) => {
        err_output += data.toString();
    });
    statusProcess.on('error', (err) => {
        sendResponse(500, false, 'Failed to execute system command (e.g., systemctl not found).', err.message);
    });
    statusProcess.on('close', (code) => {
        if (responseSent) return;

        if (code !== 0) {
            sendResponse(500, false, `Command failed or service inactive (Exit Code: ${code})`, err_output || output);
        } else {
            sendResponse(200, true, 'Service status retrieved successfully.', output);
        }
    });
});

exports.restart_nginx = (async (req, res) => {
    try {
        execSync('sudo systemctl restart nginx');
        res.json({ message: 'Nginx is restarting' });
    }catch (error) {
        console.error("Nginx restart failed:", error.message);
        res.status(500).json({ error: 'Failed to restart nginx' });
    }
});

exports.status_nginx = (async (req, res) => {
    const command = 'systemctl';
    const args = ['status', 'nginx'];
    let output = "";
    let err_output = "";
    let responseSent = false; 

    const sendResponse = (statusCode, success, message, details) => {
        if (responseSent) {
            console.warn('Attempted to send response twice, blocked.');
            return;
        }
        responseSent = true;
        res.status(statusCode).json({
            success: success,
            message: message,
            details: details,
            service_name: 'nginx'
        });
    };

    const statusProcess = spawn(command, args);

    statusProcess.stdout.on('data', (data) => {
        output += data.toString();
    });
    statusProcess.stderr.on('data', (data) => {
        err_output += data.toString();
    });
    statusProcess.on('error', (err) => {
        sendResponse(500, false, 'Failed to execute system command (e.g., systemctl not found).', err.message);
    });
    statusProcess.on('close', (code) => {
        if (responseSent) return;

        if (code !== 0) {
            sendResponse(500, false, `Command failed or service inactive (Exit Code: ${code})`, err_output || output);
        } else {
            sendResponse(200, true, 'Service status retrieved successfully.', output);
        }
    });
});
