/**
 * Inventory Repository
 */
const shop = require("../helpers/ShopifyApi");
const product = require("./Product")

var rep = {};

rep.hello = async (req, res) => {
  
  return("hello")
}

const handleQuery = () => {
  /*const sku = `"${query}"`*/
  const input = {
		"input": {
			"barcode": "555-555-555-555",
			"id": "gid://shopify/ProductVariant/43289361678493"
		}
	}
	const queryString = `{
		mutation productVariantUpdate(input: {barcode: "555-555-555-555", id: "gid://shopify/ProductVariant/43289361678493"}) {
    	productVariantUpdate(input: {input: {barcode: "555-555-555-555", id: "gid://shopify/ProductVariant/43289361678493"}}) {
      	productVariant {
        	id
        	barcode
      	}
      	userErrors {
        	message
        	field
      	}
    	}
		}
	}`
	console.log(queryString)
  const products = shop.graphql(queryString)
	console.log(products)
  return products
}

rep.barcode = async (req, res) => {
  try {
    /*const products = await shop.product.list({ limit: 250 });
    console.log(products, "products")

    return (products)*/


    /*const resp = new Promise((res, rej) => {
			setTimeout(res, 2000, handleQuery())
		})*/

		shop.productVariant.update(43289361678493, {barcode: "555-555-555-555"})

		return "listo"
  } catch (error) {
    console.log(error)
  }

  return ("hola")
}

module.exports = rep;
