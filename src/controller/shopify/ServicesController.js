const Rep = require("../../repositories/Address");
const Validator = require("../../repositories/Validator");

var ctr = {};

ctr.validateAddress = async (req, res) => {
  try {
    data = Validator.getData(req);
    Validator.validate(data, [
      { name: 'zip', rules: ['required', 'notnull']},
      { name: 'country', rules: ['required', 'string', 'notnull']},
      { name: 'city', rules: ['required', 'string', 'notnull']},
      { name: 'state', rules: ['required', 'string', 'notnull']},
      { name: 'address1', rules: ['required', 'string', 'notnull']},
      { name: 'address2', rules: ['string']},
    ]);
    //console.log(data)
    const response = await Rep.validate(data);
    res.json({data: response, error: false});
  } catch (e) {
    console.log(e.message);
    // throw e;
    if (e.message === '404') {
      res.status(404).json({
        message: "not found",
        error: true,
        error_data: e.message,
      });
    } else {
      res.status(500).json({
        message: "error unknown",
        error: true,
        error_data: e.message,
      });
    }
  }
};

module.exports = ctr;
