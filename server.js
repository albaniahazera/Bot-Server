require('dotenv').config();

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const command_routes = require('./src/routes/command')
const system_routes = require('./src/routes/system')
const setup = require('./setup.js');
const os = require('os');


(async() => {
  if (os.platform() != 'linux') {
    console.log('This application only supports Linux operating systems.');
    process.exit(1);
  }
  
  app.use(express.json());
  app.use(cors());
  
  if (fs.existsSync('./install_service.sh')) {
    await setup.setup();
    process.exit(0);
  }
  
  app.get('/', (req, res) => {
    res.send('API Running!');
  });
  app.use('/data/command', command_routes);
  app.use('/data/system', system_routes);
  
  
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})();
