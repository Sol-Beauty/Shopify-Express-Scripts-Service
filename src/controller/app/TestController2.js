const axios = require("axios");

var ctr = {};


ctr.test = async (req, res) => {
  try {
    console.log(req.body);
    res.json({
      body: req.body,
      error: false,
    });
  } catch (e) {
    res.json({
      message: e.message ? e.message : "error unknown",
      error: true,
      error_data: e.message,
      error_code: 500,
    });
  }
};

module.exports = ctr;
