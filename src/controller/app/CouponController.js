const Rep = require("../../repositories/Coupon");

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
ctr.validate = async (req, res) => {
  let coupon = req.body.coupon ? req.body.coupon.toString() : "";
  // let userId = req.body.uid ? req.body.uid.toString() : "";
  try {
    const resp = await Rep.validate(coupon);
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

ctr.getTotal = async (req, res) => {
  // let coupon = req.body.coupon ? req.body.coupon.toString() : "";
  let coupon = "SISTEMASPRUEBA123";
  let total = 100.83;
  // let userId = req.body.uid ? req.body.uid.toString() : "";
  try {
    const resp = await Rep.getTotal(total, coupon);
    res.json(resp);
  } catch (e) {
    res.json({
      message: "error unknown",
      error: true,
      error_data: e.message,
      error_code: 500,
    });
  }
};

module.exports = ctr;
