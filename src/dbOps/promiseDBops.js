const util = require("util");
const mysql = require("mysql");
const config = require('../helpers/config');

// console.log(config);

const { NODE_ENV } = process.env;
const promiseDB = () => {
  let conf = {
    host: config.DB_HOSTNAME2,
    user: config.DB_USERNAME2,
    password: config.DB_PASSWORD2,
    database: config.DB_DB2,
    port: config.DB_PORT2,
  };

  // testing log
  if (NODE_ENV === "development") {
    console.log("config db:", conf);
  }
  const connection = mysql.createConnection(conf);
  // console.log('connection', connection);
  return {
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    },
  };
};

module.exports = promiseDB;
