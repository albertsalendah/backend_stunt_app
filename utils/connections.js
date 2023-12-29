const mysql = require('mysql')
require('dotenv').config()

const db = mysql.createPool({
    connectionLimit: 10,
    host:process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:'stunt_app',
    charset : 'utf8mb4',
    //socketPath: '/cloudsql/stuntapp:asia-southeast2:stunt-app'
})

module.exports = {
    db
}
