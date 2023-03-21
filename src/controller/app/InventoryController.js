const Rep = require("../../repositories/Inventory");

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

ctr.barcode = async (req, res) => {
  try {
    const resp = await Rep.barcode(req, res)
    res.json({
      response: resp
    });
  } catch (e) {
    res.json({
      message: e.message ? e.message : "error unknown",
      error: true,
      error_data: e.message,
      error_code: 500,
    });
  }
}

module.exports = ctr;
