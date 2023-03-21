const convertUTCDateToLocalDate = require('../helpers/dateHelpers');
const dbPromise = require("../dbOps/promiseDBops");

var rep = {};
/**
 * Product Repository
 */

rep.createCustomer = async (rawData) => {
  const data = rep.customerNormalize(rawData);
  const params = rep.customerQueryParams(data);
  return await rep.saveCustomer(params);
};

rep.createSaleDetailsByArray = async (rawData, id) => {
  const arrayRaw = rawData && rawData.length > 0 ? rawData : [];
  arrayRaw.map(function (item) {
    const data = rep.saleDetailsNormalize(item);
    const params = rep.saleDetailsQueryParams(data, id);
    rep.saveSaleDetails(params);
  });
};

rep.createCronTask = async (influencerId, rawData, saleId) => {
  const data = rep.cronTaskNormalize(rawData, saleId);
  const params = rep.cronTaskQueryParams(data, influencerId);
  return await rep.savecronTask(params);
};

rep.appWebhook = async (rawData) => {
  try {
    const data = rep.saleNormalize(rawData);
    const params = rep.saleQueryParams(data);
    const saleId = await rep.saveSale(params);
    const customerId = await rep.createCustomer(data.customer);
    // console.log('customer created: ', customerId);
    await rep.createSaleDetailsByArray(data.sale_details, saleId);
    const code = data.discount_applications.length > 0 ? data.discount_applications[0].code : null;
    // validate if influencer config exist for this coupon
    const influencerId = await rep.findByCode(code);
    let gave_commission = false;
    if (influencerId) {
      // console.log('influencerId', influencerId, data, saleId);
      await rep.createCronTask(influencerId, data, saleId);
      gave_commission = true;
    }
    await rep.updateSale(customerId, gave_commission, saleId);
    // console.log(update);
    return saleId;
  } catch (err) {
    console.log(err);
  }

}

rep.saleNormalize = (data) => {
  var fechaToLocal = convertUTCDateToLocalDate(new Date(Date.now()));
  let fecha_hoy = new Date(fechaToLocal).toISOString().replace(/T/, ' ').replace(/\..+/, '');
  return {
    'sale_gid': 'gid://shopify/Order/' + data.id,
    'order_number': data.order_number,
    'note': data.note,
    'token': data.token,
    'gateway': data.gateway,
    'test': data.test,
    'total_price': data.total_price,
    'subtotal_price': data.subtotal_price,
    'total_tax': data.total_tax,
    'currency': data.currency,
    'financial_status': data.financial_status,
    'total_discounts': data.total_discounts,
    'total_line_items_price': data.total_line_items_price,
    'discount_applications': data.discount_applications,
    'discount_codes': data.discount_codes,
    'payment_gateway_names': data.payment_gateway_names,
    'contact_email': data.contact_email,
    'order_status_url': data.order_status_url,
    'created_at': fecha_hoy,
    'updated_at': fecha_hoy,
    'customer': data.customer,
    'sale_details': data.line_items,
  };

}

rep.saleQueryParams = data => {
  let {
    sale_gid,
    order_number,
    note,
    token,
    gateway,
    test,
    total_price,
    subtotal_price,
    total_tax,
    currency,
    financial_status,
    total_discounts,
    total_line_items_price,
    discount_applications,
    discount_codes,
    payment_gateway_names,
    contact_email,
    order_status_url,
    created_at, updated_at
  } = data;
  discount_applications = JSON.stringify(discount_applications)
  discount_codes = JSON.stringify(discount_codes)
  payment_gateway_names = JSON.stringify(payment_gateway_names)
  return [[sale_gid,
    order_number,
    note,
    token,
    gateway,
    test,
    total_price,
    subtotal_price,
    total_tax,
    currency,
    financial_status,
    total_discounts,
    total_line_items_price,
    discount_applications,
    discount_codes,
    payment_gateway_names,
    contact_email,
    order_status_url,
    created_at, updated_at]]
}

rep.saveSale = async (values, id) => {
  let db = dbPromise();
  try {
    // console.log("values: ", values);
    let query = `
    INSERT INTO sales (
    sale_gid, 
    order_number,
    note,
    token, 
    gateway, 
    test, 
    total_price, 
    subtotal_price, 
    total_tax, 
    currency, 
    financial_status, 
    total_discounts, 
    total_line_items_price, 
    discount_applications, 
    discount_codes, 
    payment_gateway_names, 
    contact_email, 
    order_status_url, 
    created_at, updated_at
    ) values ?`;
    const sale = await db.query(query, [values]);
    return sale.insertId;
  } catch (err) {
    console.log("error saveSale: ", values, err);
    return 0;
  } finally {
    await db.close();
  }
}

rep.updateSale = async (customer_id, gave_commission, sale_id) => {
  let db = dbPromise();
  let values = [
    customer_id,
    gave_commission,
    sale_id,
  ]
  try {
    // console.log("values: ", values);
    let query = `
        UPDATE sales SET customer_id = ?, gave_commission = ? WHERE (id = ?);
    `;
    const update = await db.query(query, values);
    return update;
  } catch (err) {
    console.log("error updateSale: ", values, err);
    return 0;
  } finally {
    await db.close();
  }
}

rep.customerNormalize = (rawData) => {
  var fechaToLocal = convertUTCDateToLocalDate(new Date(Date.now()));
  let fecha_hoy = new Date(fechaToLocal).toISOString().replace(/T/, ' ').replace(/\..+/, '');
  return {
    'customer_gid': 'gid://shopify/Order/' + rawData.id,
    'email': rawData.email,
    'first_name': rawData.first_name,
    'last_name': rawData.last_name,
    'orders_count': rawData.orders_count,
    'total_spent': rawData.total_spent,
    'currency': rawData.currency,
    'phone': rawData.phone,
    'default_address': rawData.default_address,
    'created_at': fecha_hoy,
    'updated_at': fecha_hoy
  };

}

rep.customerQueryParams = data => {
  let {
    customer_gid,
    email,
    first_name,
    last_name,
    orders_count,
    total_spent,
    currency,
    phone,
    default_address,
    created_at, updated_at
  } = data;
  default_address = JSON.stringify(default_address)
  return [[
    customer_gid,
    email,
    first_name,
    last_name,
    orders_count,
    total_spent,
    currency,
    phone,
    default_address,
    created_at, updated_at
  ]]
}

rep.saveCustomer = async (values, id) => {
  let db = dbPromise();
  try {
    // console.log("values: ", values);
    let query = `
    INSERT INTO customers (
      customer_gid,
      email,
      first_name,
      last_name,
      orders_count,
      total_spent,
      currency,
      phone,
      default_address,
      created_at, updated_at
    ) values ?`;
    const customer = await db.query(query, [values]);
    return customer.insertId;
  } catch (err) {
    console.log("error Customer Save: ", values, err);
    return 0;
  } finally {
    await db.close();
  }
}

rep.saleDetailsNormalize = (rawData) => {
  var fechaToLocal = convertUTCDateToLocalDate(new Date(Date.now()));
  let fecha_hoy = new Date(fechaToLocal).toISOString().replace(/T/, ' ').replace(/\..+/, '');
  return {
    'sale_detail_gid': rawData.admin_graphql_api_id,
    'product_gid': 'gid://shopify/Product/' + rawData.product_id,
    'variant_gid': 'gid://shopify/ProductVariant/' + rawData.variant_id,
    'title': rawData.title,
    'name': rawData.name,
    'quantity': rawData.quantity,
    'sku': rawData.sku,
    'variant_title': rawData.variant_title ?? 'none',
    'requires_shipping': rawData.requires_shipping,
    'gift_card': rawData.gift_card,
    'price': rawData.price,
    'total_discount': rawData.total_discount,
    'created_at': fecha_hoy,
    'updated_at': fecha_hoy
  };
}

rep.saleDetailsQueryParams = (data, id) => {
  let {
    sale_detail_gid,
    product_gid,
    variant_gid,
    title,
    name,
    quantity,
    sku,
    variant_title,
    requires_shipping,
    gift_card,
    price,
    total_discount,
    created_at, updated_at
  } = data;
  const sale_id = id;
  return [[
    sale_detail_gid,
    sale_id,
    product_gid,
    variant_gid,
    title,
    name,
    quantity,
    sku,
    variant_title,
    requires_shipping,
    gift_card,
    price,
    total_discount,
    created_at, updated_at
  ]]
}

rep.saveSaleDetails = async (values, id) => {
  let db = dbPromise();
  try {
    // console.log("values: ", values);
    let query = `
    INSERT INTO sale_details (
      sale_detail_gid,
      sale_id,
      product_gid,
      variant_gid,
      title,
      name,
      quantity,
      sku,
      variant_title,
      requires_shipping,
      gift_card,
      price,
      total_discount,
      created_at, updated_at
    ) values ?`;
    const sale = await db.query(query, [values]);
    return sale.insertId;
  } catch (err) {
    console.log("error sale Details Save: ", values, err);
    return 0;
  } finally {
    await db.close();
  }
}

rep.cronTaskNormalize = (rawData, saleId) => {

  const customer_name = rawData.customer ?
    (
      rawData.customer.first_name +
      ' ' +
      rawData.customer.last_name
    ) :
    '';
  console.log('rawData cron: ', rawData);
  return {
    'sale_id': saleId,
    'sale_class': 'App\\Models\\Sale',
    'order_number': rawData.order_number,
    'financial_status': rawData.financial_status,
    'subtotal_price': rawData.subtotal_price,
    'total_price': rawData.total_price,
    'customer_name': customer_name,
    'sale_source': 'app',
    'details': rawData.sale_details ? rawData.sale_details.map(function (item) {
      return {
        'price': item.price,
        'name': item.name,
        'product_gid': 'gid://shopify/Product/' + item.id,
        'variant_gid': 'gid://shopify/ProductVariant/' + item.variant_id,
        'quantity': item.quantity,
      };
    }) : [],
  };
}

rep.cronTaskQueryParams = (normalizeData, influencer_id) => {
  var fechaToLocal = convertUTCDateToLocalDate(new Date(Date.now()));
  let fecha_hoy = new Date(fechaToLocal).toISOString().replace(/T/, ' ').replace(/\..+/, '');
  let data = JSON.stringify(normalizeData);
  let type = 'create';
  let status = 'waiting';
  let saleSource = 'app';
  let created_at = fecha_hoy, updated_at = fecha_hoy;
  console.log('cron values', [
    data,
    influencer_id,
    type,
    status,
    saleSource,
    created_at, updated_at
  ]);
  return [[
    data,
    influencer_id,
    type,
    status,
    saleSource,
    created_at, updated_at
  ]]
}

rep.savecronTask = async (values) => {
  let db = dbPromise();
  try {
    let query = `
    INSERT INTO cron_influencer_vouchers (
      data,
      influencer_id,
      type,
      status,
      sale_source,
      created_at, updated_at
      ) values ?`;
    console.log("query: ", query);
    const crontask = await db.query(query, [values]);
    return crontask.insertId;
  } catch (err) {
    console.log("error cron task Save: ", values, err);
    return 0;
  } finally {
    await db.close();
  }
}

rep.findByCode = async (code) => {
  let db = dbPromise();

  let values = [[code]];
  try {
    // console.log("values: ", values);
    let query = `
    SELECT 
      c.influencer_id FROM 
      coupons as c
      left join influencers as i on i.id = c.influencer_id
      where (c.code = ?) and (i.disabled_at is null) and (i.deleted_at is null) 
    `;
    const coupons = await db.query(query, [values]);
    if (coupons.length > 0) {
      return coupons[0].influencer_id;
    } else {
      return 0;
    }
  } catch (err) {
    console.log("error find coupon: ", values, err);
    return 0;
  } finally {
    await db.close();
  }
}

module.exports = rep;
