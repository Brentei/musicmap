// modules =================================================
const express      = require('express');
const bodyparser   = require('body-parser');
const path         = require('path');
const https        = require('https');
const http         = require('http');
const app          = express();
const salzburgInfo = require('./server/routes/salzbrgInfo');

// set our port
const port = process.env.PORT || '3000';
app.set('port', port);
console.log(`Musicmap listening on port ${port}!`);


// This values are taken from an example may not apropriate for this purpose
app.use(bodyparser.json({limit:"50mb"}));
app.use(bodyparser.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));

//Point static path to dist/musicmap
app.use(express.static(path.join(__dirname, 'dist/musicmap')));

//app.use('/client', express.static('client'));
app.use('/info', salzburgInfo);

//Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/musicmap/index.html'))
})

//Bring up the server
const server = http.createServer(app);

server.listen(port, () => console.log(`API running on port: ${port}`));
