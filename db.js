const {Sequelize} = require('sequelize');
const dotenv = require("dotenv").config()

module.exports = new Sequelize(
    dotenv.parsed?.MYSQL_DB_NAME,
    dotenv.parsed?.MYSQL_USERNAME,
    dotenv.parsed?.MYSQL_PASSWORD,
    {
        host: 'localhost',
        port: '3306',
        dialect: 'mysql',
        define: {
            timestamps: false
        }
    }
)
