const { execSync } = require('child_process');

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
    try {
        const status = execSync('systemctl is-active jellyfin').toString().trim();
        res.json({ jellyfin_status: status });
    }catch (error) {
        console.error("Jellyfin status check failed:", error.message);
        res.status(500).json({ error: 'Failed to get jellyfin status' });
    }
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
    try {
        const status = execSync('systemctl is-active nginx').toString().trim();
        res.json({ nginx_status: status });
    }catch (error) {
        console.error("Nginx status check failed:", error.message);
        res.status(500).json({ error: 'Failed to get nginx status' });
    }
});
