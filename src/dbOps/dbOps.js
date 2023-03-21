const mysql = require("mysql");
const config = require('../helpers/config');

const { NODE_ENV } = process.env;

let conf = {
  host: config.DB_HOSTNAME,
  user: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_DB,
  // port: config.DB_PORT,
};

//console.log("conf: ",conf);

// testing log
if (NODE_ENV == "development") {
  console.log("config db on development:", conf);
}
// LOCAL
const mysqlConnection = mysql.createConnection(conf);

mysqlConnection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + mysqlConnection.threadId);
});

module.exports = mysqlConnection;