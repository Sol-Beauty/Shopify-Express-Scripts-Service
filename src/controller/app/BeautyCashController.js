const Rep = require("../../repositories/BeautyCash");

var ctr = {};

/**
 * @returns {json}
 * e.g =
 *  {
 *      found : true
 *      valid: true,
 *      valid_date: true,
 *      coupon: '1234',
 *      data: { value_type: 'percentage, value: '-20' },
 *      error: false
 *  }
 */
ctr.getCash = async (req, res) => {
  // let userId = req.body.uid ? req.body.uid.toString() : "";
  let email = req.body.email ? req.body.email.toString() : "";
  try {
    const cash = await Rep.getCash(email);
    res.json({
      cash: cash,
      error: false,
    });
  } catch (e) {
    res.json({
      cash: 0,
      message: e.message ? e.message : "error unknown",
      error: true,
      error_data: e.message,
      error_code: 500,
    });
  }
};

ctr.getLevel = async (req,   res) => {
  // let userId = req.body.uid ? req.body.uid.toString() : "";
  let email = req.body.email ? req.body.email.toString() : "";

  try {
    const level = await Rep.getLevel(email);
    res.json({
      level: level,
      error: false,
    });
  } catch (e) {
    res.json({
      cash: 0,
      message: e.message ? e.message : "error unknown",
      error: true,
      error_data: e.message,
      error_code: 500,
    });
  }
};

ctr.validate = async (req,   res) => {
  let userId = req.body.uid ? req.body.uid.toString() : "";
  let toSpend = req.body.spend ? req.body.spend.toString() : "";
  let email = req.body.email ? req.body.email.toString() : "";

  try {
    const resp = await Rep.validate(email, toSpend);
    res.json(resp);
  } catch (e) {
    res.json({
      found: false,
      valid: false,
      message: "error unknown",
      error: true,
      error_data: e.message,
      error_code: 500,
    });
  }
};

module.exports = ctr;
