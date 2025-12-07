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

exports.update_system = (async (req, res) => {
    const update = spawn('sudo', ['-n' ,'apt', 'update', '-y'])
    let output = '';

    try {
        update.stdout.on('data', (data) => {
            output += data.toString();
        });
        update.stderr.on('data', (data) => {
            output += `ERROR: ${data.toString()}`;
        });
        update.on('close', (code) => {
            if (code === 0) {
                res.json({ status: 'success', message: 'System update completed', output });
            } else {
                res.json({ status: 'error', message: `System update failed with code ${code}`, output });
            }
        });
        update.on('error', (error) => {
            res.status(500).json({error: `ERROR: ${error.message}`})
        });
    }catch (error) {
        console.error("System update failed:", error.message);
        res.status(500).json({ error: 'Failed to update system' });
    }
});

exports.upgrade_system = (async (req, res) => {
    const upgrade = spawn('sudo', ['-n' ,'apt', 'upgrade', '-y'])
    let output = '';

    try {
        upgrade.stdout.on('data', (data) => {
            output += data.toString();
        });
        upgrade.stderr.on('data', (data) => {
            output += `ERROR: ${data.toString()}`;
        });
        upgrade.on('close', (code) => {
            if (code === 0) {
                res.json({ status: 'success', message: 'System upgrade completed', output });
            } else {
                res.json({ status: 'error', message: `System upgrade failed with code ${code}`, output });
            }
        });
        upgrade.on('error', (error) => {
            res.status(500).json({error: `ERROR: ${error.message}`})
        });
    }catch (error) {
        console.error("System upgrade failed:", error.message);
        res.status(500).json({ error: 'Failed to upgrade system' });
    }
});