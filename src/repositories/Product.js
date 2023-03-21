const shop = require("../helpers/ShopifyApi");

var rep = {};
/**
 * Product Repository
 */

rep.all = async () => {
  try {
    return await shop.product.list({ limit: 250 });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

rep.byIds = async (ids) => {
  try {
    // console.log(ids.toString());
    return await shop.product.list({ ids: ids.toString(), limit: 250 });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

rep.collectionsWithPids = async () => {
  try {
    var cat = await shop.collectionListing.list();
    var categories = [];
    for (i in cat) {
      var c = cat[i];
      var ids = await shop.collectionListing.productIds(c.collection_id, { limit: 250 });
      categories.push({ id: c.collection_id, title: c.title, products: ids });
    }
    return categories;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

rep.collectionWithProducts = async (id) => {
  try {
    var pids = await shop.collectionListing.productIds(id, { limit: 250 });
    var products = await rep.byIds(pids);
    products = products ? rep._filterProducts(products) : []
    return products;
  } catch (e) {
    console.log(e);
    throw e;
  }
};



rep._filterProducts = (products) => {
  return products.reduce((data, product) => {
    if (product && product.images && product.images.length > 0 && product.status == 'active') {
      if (
        product.product_type === 'swimsuit' ||
        product.product_type === 'preventa' ||
        product.product_type === 'lingerie' ||
        (product.template_suffix === 'unavailable' && product.product_type === 'unavailable')
      ) {
        // product no disponible para la app movil
      } else {
        var newProduct = rep._makeProduct(product);
        if (newProduct.variants.length > 0) {
          data.push(newProduct);
        }
      }
    }
    return data;
  }, []);
}

rep._makeProduct = (product) => {
  var variants = product.variants.filter(v => {
    return Number(v.inventory_quantity) > 0;
  });
  product.variants = variants;
  if (product.variants.length > 0) {
    product.size = rep.makeOptions(product.variants, 'option1');
    product.color = rep.makeOptions(product.variants, 'option2');
  }
  return product;
}

rep.makeOptions = (variants, option) => {
  return variants.reduce((data, v) => {
    if (data.indexOf(v[option])) {
      data.push(v[option]);
    }
    return data;
  }, []);
}

rep.getProducts = async () => {
  var products = await rep.all();
  // console.log(products);
  return products ? rep._filterProducts(products) : [];
};




rep._filterAddCategories = (cat, id) => {
  // console.log('add cat');
  return cat.reduce((data, c) => {
    // console.log(id, c.products);
    var p = c.products.filter(pid => pid === id);
    if (p.length > 0) {
      data.push({ title: c.title, id: c.id });
    }
    return data;
  }, []);
}


rep.getFeed = async () => {
  var cat = await rep.collectionsWithPids();
  var products = await rep.getProducts();
  products = products.map(p => {
    p.categories = rep._filterAddCategories(cat, p.id);
    return p;
  });

  return { products, cat };
};

rep.getProductById = async (id) => {
  try {
    id = Number(id);
    return await shop.product.get(id);
  } catch (e) {
    console.log(e);
    throw e;
  }
}



module.exports = rep;
