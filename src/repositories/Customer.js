/**
 * Inventory Repository
 */
const shop = require("../helpers/ShopifyApi");

var rep = {};

rep.hello = async (req, res) => {
  
  const handleQuery = (query) => {
    const sku = `"${query}"`
    const queryString = `{
      products(first: 1, query: ${sku}) {
        nodes {
          id
          variants(first: 50) {
            nodes {
              id
              weight
              sku
            }            
          }
        }
      }
    }` 

    const products = shop.graphql(queryString)
    return products
  }

  const {data} = req.body

  const resp = Promise.all(
    data.map(async (obj) => {
      return new Promise((res, rej) => {
        setTimeout(res, 1000, handleQuery(obj.sku).then(res => res.products.nodes[0], "node res"))
      })
    })
  )
  
  return resp
}

module.exports = rep;
