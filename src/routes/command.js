const express = require('express');
const router = express.Router();
const validate_api_key = require('../middleware/check_api_key');
const { 
    shutdown_system, 
    restart_system, 
    restart_jellyfin, 
    status_jellyfin, 
    restart_nginx, 
    status_nginx, 
    status_cloudflared
} = require('../controllers/execute_commands');
const check_service = require('../middleware/check_service');
router.use(validate_api_key);


router.post('/shutdown', check_service('shutdown'), shutdown_system);
router.post("/restart", check_service('restart'), restart_system);
router.post("/restart-jellyfin", check_service('restart_jellyfin'), restart_jellyfin);
router.post("/status-jellyfin", check_service('status_jellyfin'), status_jellyfin);
router.post("/restart-nginx", check_service('restart_nginx'), restart_nginx);
router.post("/status-nginx", check_service('status_nginx'), status_nginx);
router.post("/status-cloudflared", check_service('status_cloudflared'), status_cloudflared);

module.exports = router;