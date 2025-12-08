const configModule = require('../../config/config');

function checkServiceEnabled(service_name) {
    return (req, res, next) => {
        const currentConfig = configModule.getConfig();
        if (currentConfig[service_name] === true) {
            next();
        } else {
            res.status(403).send('Service is disabled in service.conf');
        }
    }
}

module.exports = checkServiceEnabled;