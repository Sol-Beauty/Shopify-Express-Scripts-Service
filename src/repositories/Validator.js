const { validate } = require("./Coupon");

var rep = {};
/**
 * Validator Repository
 */
/**
 * 
 * values  = 
 * [
 *     property: 'name'
 * ]
 * 
 * validates =
 * [
 *  validator 
 *  [ 
 *    rule 
 *          [
 *              
 *          ]
 *  ]
 * ]
 * @param {*} values 
 * @param {*} validates 
 */
rep.validate = (values, validates) => {
    for (i in validates) {
        let validator = validates[i];
        // console.log(values);

        for(r in validator.rules) {
            let rule = validator.rules[r];
            if (rule === 'required') {
                // console.log(rule, validator, validator.name, validates);
                if (values && values.hasOwnProperty(validator.name)) {
                    // console.log(values[validator.name], 'asdas')
                    continue;
                } else {
                    throw new Error(JSON.stringify({validated: validator.name+ ' is required'}), 422);
                }
            } else if (rule === 'string') {
                let vlue = values[validator.name] ? values[validator.name] : '';
                if (values && (typeof vlue  === 'string')) {
                    continue;
                } else {
                    throw new Error(JSON.stringify({validated: validator.name+ ' is not string'}), 422);
                }
            } else if (rule === 'number') {
                let vlue = values[validator.name]
                if (values && (typeof vlue === 'number')) {
                    continue;
                } else {
                    throw new Error(JSON.stringify({validated: validator.name+ ' is not number'}), 422);
                }
            }  else if (rule === 'bool') {
                let vlue = values[validator.name];
                if (values && (typeof vlue === 'boolean')) {
                    continue;
                } else {
                    throw new Error(JSON.stringify({validated: validator.name+ ' is not boolean'}), 422);
                }
            }   else if (rule === 'notnull') {
                let vlue = values[validator.name];
                if (values && (vlue !== null)) {
                    continue;
                } else {
                    throw new Error(JSON.stringify({validated: validator.name+ ' is null'}), 422);
                }
            } 
        }
    }
}

rep.getData = (req) => {
    var body = req.body;
    // console.log('body', body);
    var data = {};
    if(body.data) {
        data = JSON.parse(body.data);
        // console.log(data);
    }
    return data;
}

rep.getOrError = (req, value) => {

}

module.exports = rep;
