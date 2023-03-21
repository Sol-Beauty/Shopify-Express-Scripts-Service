const Validator = require("../../repositories/Validator");
const Rep = require("../../repositories/Calculator");
const { validate } = require("../../repositories/Coupon");
const { country } = require("../../helpers/ShopifyApi");

var ctr = {};


ctr.getSizeJeans = async (req, res) => {
  try {
    data = Validator.getData(req);
    
    console.log('ready',  data);
    let tight = data.ajustment ? data.ajustment.toLowerCase().trim() === 'firme': true; 
    let  cm = data.measure ? String(data.measure).trim().toLocaleLowerCase() === 'cm' : "";
    const { country, hip, waist } = data;
    var resp = Rep.findSize({ tight, cm, country: country ? country.trim().toLocaleLowerCase() : 'mexico', hip: Number(hip), waist: Number(waist) });
    // const resp = await Rep.getTotal(total, coupon);
    // res.json(resp);
    res.json(resp.co);
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
