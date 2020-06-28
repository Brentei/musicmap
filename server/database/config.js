const Pool = require('pg').Pool

//install dotenv to get variables from environment


const pool = new Pool({
  user: 'music_map_user',
  host: 'localhost',
  database: 'music_map',
  password: 'avFHqgaEYTMEmBQ4EptM3ELmy2Y6fRrSzBTWjdu7PVAg2Q3a9u',
  port: 5432,
})

module.exports = pool;
