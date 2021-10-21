const dotenv = require('dotenv');
dotenv.config();
console.log('H0ST',process.env.POSTGRE_HOST, 'bd', process.env.POSTGRE_DATABASE)
module.exports = {
  postgre: {
    user: process.env.POSTGRE_USER,
    password: process.env.POSTGRE_PASS,
    host: process.env.POSTGRE_HOST,
    database: process.env.POSTGRE_DATABASE,
    port: process.env.POSTGRE_PORT
  },
  server: {
    port: 3800
  }
}