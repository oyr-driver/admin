//.env 
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    // host:'localhost',
    // user: 'root',
    // password:'20200128!!',
    // database:'gooddrive'
    host: process.env.DATABASE_HOST,
    user: 'admin',
    password:process.env.DATABASE_PW,
    database:'LC'
}