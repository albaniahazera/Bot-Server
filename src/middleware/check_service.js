const config = require('../../config/config');

function checkServiceEnabled(service_name) {
    return (req, res, next) => {
        if (config[service_name] === true) {
            next();
        } else {
            res.status(403).send('Service is disabled in service.conf');
        }
    }
}

module.exports = checkServiceEnabled;