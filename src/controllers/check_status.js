const si = require('systeminformation');

exports.sys_status = (async (req, res) => {
    try {
        const [cpu, memory, os_info, disk] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.osInfo(),
            si.fsSize()
        ]);

        res.json({
            cpu_load: cpu.currentLoad.toFixed(2),
            os_distro: os_info.distro,
            memory_usage: {
                total: (memory.total / (1024 ** 3)).toFixed(2),
                free: (memory.free / (1024 ** 3)).toFixed(2),
                used: ((memory.total - memory.free) / (1024 ** 3)).toFixed(2)
            },
            disk_usage: disk.map(d => ({
                fs: d.fs,
                used: (d.used / (1024 ** 3)).toFixed(2),
                free: ((d.size - d.used) / (1024 ** 3)).toFixed(2),
                size: (d.size / (1024 ** 3)).toFixed(2)
            }))
        });
    } catch (error) {
        console.error('Error retrieving system data:', error.message);
        res.status(500).json({ error: 'Failed to retrieve system data' });
    }
});

exports.cpu_info = (async (req, res) => {
    try {
        const cpu = await si.cpu();
        res.json({
            manufacturer: cpu.manufacturer,
            brand: cpu.brand,
            speed: cpu.speed,
            cores: cpu.cores,
            physicalCores: cpu.physicalCores
        });
    }catch (error) {
        console.error('Error retrieving CPU data:', error.message);
        res.status(500).json({ error: 'Failed to retrieve CPU data' });
    }
});

exports.memory_info = (async (req, res) => {
    try {
        const memory = await si.mem();
        res.json({
            manufacturer: memory.manufacturer || 'N/A',
            brand: memory.brand || 'N/A',
            speed: memory.speed || 'N/A',
        });
    }catch (error) {
        console.error('Error retrieving Memory data:', error.message);
        res.status(500).json({ error: 'Failed to retrieve Memory data' });
    }
});

exports.disk_info = (async (req, res) => {
    try {
        const disk = await si.diskLayout();
        res.json(disk.map(d => ({
            type: d.type,
            name: d.name,
        })));
    }catch (error) {
        console.error('Error retrieving Disk data:', error.message);
        res.status(500).json({ error: 'Failed to retrieve Disk data' });
    }
});

exports.os_info = (async (req, res) => {
    try {
        const os_info = await si.osInfo();
        res.json({
            platform: os_info.platform,
            distro: os_info.distro,
            release: os_info.release,
            kernel: os_info.kernel,
            arch: os_info.arch
        });
    }catch (error) {
        console.error('Error retrieving OS data:', error.message);
        res.status(500).json({ error: 'Failed to retrieve OS data' });
    }
});

exports.ping = ((req, res) => {
    res.json({ message: 'pong' });
});