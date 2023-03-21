const admin = require("firebase-admin");
const config = require('./config');


// console.log(config.FB_CREDENTIALS);

const defaultAdmin = admin.initializeApp({
  credential : admin.credential.applicationDefault(),
  databaseURL:config.FB_DB
}); // init an app default for multiples instancies

const accountConfig = {
  credential: admin.credential.cert(config.FB_CREDENTIALS),
  databaseURL: config.FB_DB
};
const adminSol = admin.initializeApp(accountConfig, 'singleton');


module.exports = adminSol;
