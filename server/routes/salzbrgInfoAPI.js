const express     = require('express');
const router      = express.Router();
const https       = require('https');
const pool         = require('../database/config');

/*
  To use the following lines of code install cron
  I gues npm install cron --save
  not needed for now, but this would be a possible
  substitution of jakobs python scripts to update the db
 */
// var CronJob       = require('cron').CronJob;
//
// var job = new CronJob('00 55 23 * * 1-5', function () {
//   /*
//    *  Runs every weekday (Monday to Friday)
//    *  at 11:30:00 AM. It does not run on Saturday
//    *  or Sunday
//    */
//
//
//   //Setting the api routes
//   //Read data from api
//   https.get('https://www.salzburg.info/webservice/event-calendar?apikey=2ff7c29a173adcc4b2ba09c4dbd8fa6a7efb0914a5367d501811acdda0d51e38&limit=20&offset=100&locale=de', (resp) => {
//     let data = '';
//
//     // A chunk of data has been recieved.
//     resp.on('data', (chunk) => {
//       data += chunk;
//     });
//
//     // The whole response has been received. Print out the result.
//     resp.on('end', () => {
//       console.log('Were parsing');
//       console.log(JSON.parse(data));
//     });
//
//   }).on("error", (err) => {
//     console.log("Error: " + err.message);
//   });
// })


// Testing the DB with users
const getX = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC ', (error, results) => {
    if(error){
      throw error
    }
    response.status(200).json(results.rows)
  })
}

router.get('/getUsers', (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC ', (error, results) => {
    if(error){
      throw error
    }
    response.status(200).json(results.rows)
  })
});

const salburgInfoURL = 'https://www.salzburg.info/webservice/event-calendar?apikey=2ff7c29a173adcc4b2ba09c4dbd8fa6a7efb0914a5367d501811acdda0d51e38&limit=10&offset=100&locale=de';

router.get('/getInfo', (req, res) => {
  https.get(salburgInfoURL, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log('Were parsing');
      console.log(JSON.parse(data));

    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });

});
module.exports = router;
