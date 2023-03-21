const shop = require("../helpers/ShopifyApi");
const _ = require("lodash");
const moment = require("moment");

var rep = {};
/**
 * Coupon Repository
 */

/**
 * @method all
 * @returns {json, Array} prices list of shopify
 *
 */
rep.all = async () => {
  try {
    const coupons = await shop.priceRule.list({ limit: 250 });
    return coupons;
  } catch (e) {
    console.log(e);
    throw e;
  }
};


/**
 *
 * @param {String} title coupon code
 * @param {json, Array} json price list
 * @returns {boolean, json}
 */
rep.findByTitle = (title, json) => {
  const filter = json.filter((elem) => {
    var code = elem.title;
    return title === code;
  });
  return filter ? _.first(filter) : false;
};

/**
 *
 * @param {date} starts_at
 * @param {date} ends_at
 * @returns {boolean}
 */
rep.validDates = (starts_at, ends_at) => {
  const now = moment();
  // console.log("now", now.format("LLLL"));
  var startAt = moment(starts_at);
  // console.log("starts", startAt.format("LLLL"));
  var endsAt = moment(ends_at);
  // console.log(ends_at, endsAt.format("LLLL"));
  // console.log("now.isBetween(startAt, endsAt)", now.isBetween(startAt, endsAt));
  // console.log("now.isSameOrAfter(startAt)", now.isSameOrAfter(startAt));

  /**
   * moment('2010-10-20').isBetween('2010-10-19', '2010-10-25'); // true
   * moment('2010-10-20').isSameOrAfter('2010-10-19'); // true
   **/
  return starts_at
    ? ends_at
      ? now.isBetween(startAt, endsAt)
      : now.isSameOrAfter(startAt)
    : false;
};

/**
 *
 * @param {array, json} ids
 * @param {String} userId
 * @returns {boolean}
 */
rep.validIds = (ids, userId) => {
  return (
    _.find(ids, (id) => {
      return id.toString() === userId.toString();
    }) != undefined
  );
};

/**
 *
 * @param {Array, json} json
 * @param {String} id
 * @returns {boolean}
 */
rep.validCustumers = (json, id) => {
  const { customer_selection, prerequisite_customer_ids } = json;
  console.log({
    customer_selection, prerequisite_customer_ids,
    id,
    json

  });
  return customer_selection === "all"
    ? true
    : rep.validIds(prerequisite_customer_ids, id);
};

rep.isCouponValid = async (coupon) => {
  var json = await rep.all();
  var find = await rep.findByTitle(coupon, json);
  return find ? rep.validDates(find.starts_at, find.ends_at) : false;
}

rep.getTotal = async (subtotal, coupon) => {
  console.log("getTotal - subtotal: ", subtotal);
  var couponResp = await rep.validate(coupon);
  var total = 0;
  var discount = 0;
  if (couponResp.valid === true) {
    if (couponResp.data.value_type === "percentage") {
      let percenFraction = couponResp.data.value !== 0 ? couponResp.data.value / 100 : 0;
      discount = percenFraction !== 0 ? percenFraction * subtotal : 0;
      total = Number((subtotal - Math.abs(discount)).toFixed(2));
      console.log(total, 'by percent');
    } else if (couponResp.data.value_type === "fixed_amount") {
      discount = couponResp.data.value;
      total = Number((subtotal - Math.abs(discount)).toFixed(2));
      console.log(total, 'other');
    } else {
      console.log('no escribi codigo para este tipo de cupon :C');
      throw Error('not found type value', 500);
    }

    return {
      coupon,
      data: {
        total,
        subtotal,
        discount: Number((discount).toFixed(2)),
        value_type: couponResp.data.value_type,
        value: couponResp.data.value

      },
      error: false
    };
  }
  return {
    coupon,
    subtotal,
    data: couponResp,
    error: true,
  };
}

/**
 * Valid a cupon with a userId
 * @param {String} coupon
 * @returns {json } json response
 * e.g =
 *  {
 *      found: true,
 *      valid: true,
 *      valid_date: true,
 *      coupon: '1234',
 *      data: { value_type: 'percentage, value: '-20' },
 *      error: false
 *  }
 */
rep.validate = async (coupon) => {
  var json = await rep.all();
  // console.log(json);
  var find = await rep.findByTitle(coupon, json);
  if (find) {
    var valid = rep.validDates(find.starts_at, find.ends_at);
    return {
      found: true,
      valid,
      valid_date: valid,
      coupon,
      data: {
        value_type: find.value_type,
        value: find.value,
      },
      error: false,
    };
  }
  return {
    found: false,
    valid: false,
    valid_date: null,
    coupon,
    data: null,
    error: false,
  };
};

module.exports = rep;
