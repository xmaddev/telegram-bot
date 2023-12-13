const {Sequelize} = require('sequelize');
require("dotenv").config()
const {MYSQL_DB_NAME,MYSQL_USERNAME,MYSQL_PASSWORD} = process.env;
module.exports = new Sequelize(
    MYSQL_DB_NAME,
    MYSQL_USERNAME,
    MYSQL_PASSWORD,
    {
        host: '148.251.3.184',
        port: '3306',
        dialect: 'mysql',
        define: {
            timestamps: false
        }
    }
)
