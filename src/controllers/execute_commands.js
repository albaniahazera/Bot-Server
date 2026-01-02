const { execSync, spawn, exec } = require('child_process');
const util = require('util');
const exec_promise = util.promisify(exec);

exports.shutdown_system = (async (req, res) => {
    try {
        execSync('sudo shutdown now');
        res.json({
            status: 'success',
            message: 'System is shutting down' 
        });
    } catch (err) {
        console.error("Shutdown failed:", err.message);
        res.status(500).json({
            status: 'error', 
            error: 'Failed to shutdown system'
        });
    }
});

exports.restart_system = (async (req, res) => {
    try {
        execSync('sudo reboot');
        res.json({
            status: 'success',
            message: 'System is restarting'
        });
    }catch (err) {
        console.error("Reboot failed:", err.message);
        res.status(500).json({
            status: 'error',
            error: 'Failed to restart system'
        });
    }
});

exports.restart_jellyfin = (async (req, res) => {
    try {
        execSync('sudo systemctl restart jellyfin');
        res.json({
            status: 'success',
            message: 'Jellyfin is restarting'
        });
    }catch (err) {
        console.error("Jellyfin restart failed:", err.message);
        res.status(500).json({
            status: 'error',
            error: 'Failed to restart jellyfin'
        });
    }
});

exports.status_jellyfin = (async (req, res) => {
    const command = 'systemctl';
    const args = ['status', 'jellyfin'];
    let output = "";
    let err_output = "";
    let response_sent = false; 

    const send_response = (status_code, success, message, details) => {
        if (response_sent) {
            console.warn('Attempted to send response twice, blocked.');
            return;
        }
        response_sent = true;
        res.status(status_code).json({
            success: success,
            message: message,
            details: details,
            service_name: 'jellyfin'
        });
    };

    const status_process = spawn(command, args);

    status_process.stdout.on('data', (data) => {
        output += data.toString();
    });
    status_process.stderr.on('data', (data) => {
        err_output += data.toString();
    });
    status_process.on('error', (err) => {
        send_response(500, false, 'Failed to execute system command (e.g., systemctl not found).', err.message);
    });
    status_process.on('close', (code) => {
        if (response_sent) return;

        if (code !== 0) {
            send_response(500, false, `Command failed or service inactive (Exit Code: ${code})`, err_output || output);
        } else {
            send_response(200, true, 'Service status retrieved successfully.', output);
        }
    });
});

exports.restart_nginx = (async (req, res) => {
    try {
        execSync('sudo systemctl restart nginx');
        res.json({
            status: 'success',
            message: 'Nginx is restarting'
        });
    }catch (err) {
        console.error("Nginx restart failed:", err.message);
        res.status(500).json({
            status: 'error',
            error: 'Failed to restart nginx'
        });
    }
});

exports.status_nginx = (async (req, res) => {
    const command = 'systemctl';
    const args = ['status', 'nginx'];
    let output = "";
    let err_output = "";
    let response_sent = false; 

    const send_response = (status_code, success, message, details) => {
        if (response_sent) {
            console.warn('Attempted to send response twice, blocked.');
            return;
        }
        response_sent = true;
        res.status(status_code).json({
            success: success,
            message: message,
            details: details,
            service_name: 'nginx'
        });
    };

    const status_process = spawn(command, args);

    status_process.stdout.on('data', (data) => {
        output += data.toString();
    });
    status_process.stderr.on('data', (data) => {
        err_output += data.toString();
    });
    status_process.on('error', (err) => {
        send_response(500, false, 'Failed to execute system command (e.g., systemctl not found).', err.message);
    });
    status_process.on('close', (code) => {
        if (response_sent) return;

        if (code !== 0) {
            send_response(500, false, `Command failed or service inactive (Exit Code: ${code})`, err_output || output);
        } else {
            send_response(200, true, 'Service status retrieved successfully.', output);
        }
    });
});

exports.status_cloudflared = (async (req, res) => {
    const command = 'systemctl';
    const args = ['status', 'cloudflared'];
    let output = "";
    let err_output = "";
    let response_sent = false; 

    const send_response = (status_code, success, message, details) => {
        if (response_sent) {
            console.warn('Attempted to send response twice, blocked.');
            return;
        }
        response_sent = true;
        res.status(status_code).json({
            success: success,
            message: message,
            details: details,
            service_name: 'cloudflared'
        });
    };

    const status_process = spawn(command, args);

    status_process.stdout.on('data', (data) => {
        output += data.toString();
    });
    status_process.stderr.on('data', (data) => {
        err_output += data.toString();
    });
    status_process.on('error', (err) => {
        send_response(500, false, 'Failed to execute system command (e.g., systemctl not found).', err.message);
    });
    status_process.on('close', (code) => {
        if (response_sent) return;

        if (code !== 0) {
            send_response(500, false, `Command failed or service inactive (Exit Code: ${code})`, err_output || output);
        } else {
            send_response(200, true, 'Service status retrieved successfully.', output);
        }
    });
});

exports.check_log_file = (async (req, res) => {
    try{
        const command = `find /var/log/nginx -maxdepth 1 -type f -name "*.log*" ! -name "*.gz"`;
        const { stdout } = await exec_promise(command);
        const files = stdout.trim().split('\n').map(file => file.split('/').pop());
        
        res.json({
            status: 'success',
            files
        });
    }catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed list log', error: err.message });
    }
});

exports.read_log_file = (async (req, res) => {
    const { fileName } = req.body;

    if (!fileName || fileName.includes('..') || !fileName.includes('.log')) {
        return res.status(400).json({ status: 'error', message: 'Invalid name file' });
    }
    try{
        const { stdout } = await exec_promise(`tail -n 100 /var/log/nginx/${fileName}`);
        
        res.json({
            status: 'success',
            logs: stdout
        });
    }catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed reading file' });
    }
});

exports.status_postgresql = (async (req, res) => {
    const command = 'systemctl';
    const args = ['status', 'postgresql'];
    let output = "";
    let err_output = "";
    let response_sent = false; 

    const send_response = (status_code, success, message, details) => {
        if (response_sent) {
            console.warn('Attempted to send response twice, blocked.');
            return;
        }
        response_sent = true;
        res.status(status_code).json({
            success: success,
            message: message,
            details: details,
            service_name: 'postgresql'
        });
    };

    const status_process = spawn(command, args);

    status_process.stdout.on('data', (data) => {
        output += data.toString();
    });
    status_process.stderr.on('data', (data) => {
        err_output += data.toString();
    });
    status_process.on('error', (err) => {
        send_response(500, false, 'Failed to execute system command (e.g., systemctl not found).', err.message);
    });
    status_process.on('close', (code) => {
        if (response_sent) return;

        if (code !== 0) {
            send_response(500, false, `Command failed or service inactive (Exit Code: ${code})`, err_output || output);
        } else {
            send_response(200, true, 'Service status retrieved successfully.', output);
        }
    });
});