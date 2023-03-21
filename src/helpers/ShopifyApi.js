const shopifyAPI = require("shopify-api-node");

const config = require('./configDevOps');

const Stores = {}

//Dev store
Stores.Dev_Shopify = new shopifyAPI({
  shopName: config.DEV_SHOP_NAME,
  apiKey: config.DEV_API_KEY,
  password: config.DEV_PASSSWORD
});

//Pagina web USA
Stores.Mercurio_Shopify = new shopifyAPI({
  shopName: config.MERCURIO_SHOP_NAME,
  apiKey: config.MERCURIO_API_KEY,
  password: config.MERCURIO_PASSSWORD
});

//Boutiques Mexico
Stores.Jupiter_Shopify = new shopifyAPI({
  shopName: config.JUPITER_SHOP_NAME,
  apiKey: config.JUPITER_API_KEY,
  password: config.JUPITER_PASSSWORD
});

//Boutiques USA
Stores.Saturno_Shopify = new shopifyAPI({
  shopName: config.SATURNO_SHOP_NAME,
  apiKey: config.SATURNO_API_KEY,
  password: config.SATURNO_PASSSWORD
});

module.exports = Stores;
