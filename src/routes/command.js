const express = require('express');
const router = express.Router();
const validate_api_key = require('../middleware/check_api_key');
const { shutdown_system, restart_system, restart_jellyfin, status_jellyfin, restart_nginx, status_nginx } = require('../controllers/execute_commands');
const check_service = require('../middleware/check_service');


router.post('/shutdown', check_service('shutdown'), validate_api_key, shutdown_system);
router.post("/restart", check_service('restart'), validate_api_key, restart_system);
router.post("/restart-jellyfin", check_service('restart_jellyfin'), validate_api_key, restart_jellyfin);
router.post("/status-jellyfin", check_service('status_jellyfin'), validate_api_key, status_jellyfin);
router.post("/restart-nginx", check_service('restart_nginx'), validate_api_key, restart_nginx);
router.post("/status-nginx", check_service('status_nginx'), validate_api_key, status_nginx);

// optional
// router.post("/update", update_system);
// router.post("/upgrade", upgrade_system);

module.exports = router;