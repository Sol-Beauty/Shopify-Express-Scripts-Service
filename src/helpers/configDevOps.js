const env = process.env.NODE_ENV || 'production';
const config = require('../../config.json')[env];
module.exports = config;