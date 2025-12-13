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
            cache: cpu.cache,
            family: cpu.family,
            flags: cpu.flags,
            governor: cpu.governor,
            model: cpu.model,
            performanceCores: cpu.performanceCores,
            efficiencyCores: cpu.efficiencyCores,
            processors: cpu.processors,
            revision: cpu.revision,
            socket: cpu.socket,
            speed_max: cpu.speedMax,
            speed_min: cpu.speedMin,
            stepping: cpu.stepping,
            verndor: cpu.vendor,
            virtualization: cpu.virtualization,
            voltage: cpu.voltage,
            physicalCores: cpu.physicalCores   
        });
    }catch (error) {
        console.error('Error retrieving CPU data:', error.message);
        res.status(500).json({ error: 'Failed to retrieve CPU data' });
    }
});

exports.memory_info = (async (req, res) => {
    try {
        const memory = await si.memLayout();

        if (memory.length === 0) {
            return res.status(404).json({ error: 'No Memory data found' });
        }

        const first_memory = memory[0];

        res.json({
            memory_total: first_memory.size,
            memory_bank: first_memory.bank,
            memory_clock_speed: first_memory.clockSpeed,
            memory_ecc: first_memory.ecc,
            memory_form_factor: first_memory.formFactor,
            memory_manufacturer: first_memory.manufacturer,
            memory_part_number: first_memory.partNum,
            memory_serial_number: first_memory.serialNum,
            memory_type: first_memory.type,
            memory_vol_config: first_memory.voltageConfigured,
            memory_vol_max: first_memory.voltageMax,
            memory_vol_min: first_memory.voltageMin
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
            bytes_per_sector: d.bytesPerSector,
            device: d.device,
            firmware_revision: d.firmwareRevision,
            interface_type: d.interfaceType,
            sectors_per_track: d.sectorsPerTrack,
            serial_num: d.serialNum,
            size: d.size,
            smart_data: d.smartData,
            smart_status: d.smartStatus,
            temperature: d.temperature,
            total_cylinders: d.totalCylinders,
            total_heads: d.totalHeads,
            total_sectors: d.totalSectors,
            total_tracks: d.totalTracks,
            tracks_per_cylinder: d.tracksPerCylinder,
            vendor: d.vendor
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
            arch: os_info.arch,
            build: os_info.build,
            code_name: os_info.codename,
            code_page: os_info.codepage,
            fqdn: os_info.fqdn,
            host_name: os_info.hostname,
            hypervizor: os_info.hypervizor,
            logo_file: os_info.logofile,
            remote_session: os_info.remoteSession,
            serial: os_info.serial,
            service_pack: os_info.servicepack,
            uefi: os_info.uefi
        });
    }catch (error) {
        console.error('Error retrieving OS data:', error.message);
        res.status(500).json({ error: 'Failed to retrieve OS data' });
    }
});

exports.network_info = (async (req, res) => {
    try {
        const net_stat = await si.networkStats();
        let network_data = {};

        net_stat.forEach(iface => {
            const name = iface.iface;
            let type = null;

            if(name.startsWith('wl')) {
                type = 'Wireless (wifi)'
            }else if (name.startsWith('en')) {
                type = 'Ethernet (wired)'
            }else if (name.startsWith('lo')) {
                return;
            }
            
            if(type) {
                const rx_mb = (iface.rx_sec / (1024 * 1024)).toFixed(2);
                const tx_mb = (iface.tx_sec / (1024 * 1024)).toFixed(2);
            
                network_data[name] = {
                    interface: name,
                    type: type,
                    bytes_received_MB: rx_mb,
                    bytes_sent_MB: tx_mb,
                    packets_received: iface.rx_sec,
                    packets_sent: iface.tx_sec
                };
            };
        });

        if(Object.keys(network_data).length === 0) {
            return res.status(404).json({ error: 'No active Ethernet (en) or Wireless (wl) interfaces found.' });
        }

        res.json(network_data);
    }catch (error){
        console.error('Error retrieving network stats:', error.message);
        res.status(500).json({ error: 'Failed to retrieve network stats' });
    }
});