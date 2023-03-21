const Rep = require("../../repositories/Customer");

var ctr = {};

ctr.hello = async (req, res) => {
  try {
    const resp = await Rep.hello(req, res)
    res.json({
      hello: resp
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
