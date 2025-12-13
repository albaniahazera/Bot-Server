require('dotenv').config();

const validate_api_key = (req, res, next) => {
    const visitorIp = req.ip;
    const api_key = req.header('API_KEY');
    if (api_key === process.env.API_KEY) {
        console.log(`data accessed by visitor with IP: ${visitorIp}`);
        next();
    }else {
        res.status(401).json({message: 'Forbidden: Invalid API Key'});
    }
};

module.exports = validate_api_key;