const express = require('express');
const router = express.Router();
const validate_api_key = require('../middleware/check_api_key');
const { sys_status, cpu_info, memory_info, disk_info, os_info, network_info } = require('../controllers/check_status');
const check_service = require('../middleware/check_service');

router.post('/status', check_service('server_status'), validate_api_key, sys_status);
router.post('/cpu', check_service('cpu_info'), validate_api_key, cpu_info);
router.post('/memory', check_service('memory_info'), validate_api_key, memory_info);
router.post('/disk', check_service('disk_info'), validate_api_key, disk_info);
router.post('/os', check_service('os_info'), validate_api_key, os_info);
router.post('/network', check_service('network'), validate_api_key, network_info);

module.exports = router;