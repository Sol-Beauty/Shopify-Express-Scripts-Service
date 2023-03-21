const BeatyCash = require("../../repositories/BeautyCash");
const Product = require("../../repositories/Product");
const Cron = require("../../repositories/Cron");

global.fetch = require("node-fetch");
const axios = require('axios');
const { base64encode, base64decode } = require('nodejs-base64');

var ctr = {};

ctr.testOrder = async (req, res) => {
  axios
  .post('http://localhost/api/test/curl', {
    body: req.body
  })
  .then(res => {
    console.log(res)
  })
  .catch(error => {
    console.error(error)
  })
  res.json({
    error: false,
  });
};

ctr.testHello = async (req, res) => {
  try {
    console.log(res.body);
    res.json({
      error: false,
    });
  } catch (e) {
    res.json({
      message: e.message ? e.message : "error unknown",
      error: true,
      error_data: e.message,
      error_code: 500,
    });
  }
};
ctr.burncash = async (req, res) => {
  const { email, spent, total} = req.params;
try {
  const burn = await BeatyCash.burnCash(email, spent, total, true);
  res.json({
    burn,
    error: false,
  });
} catch (e) {
  res.json({
    message: e.message ? e.message : "error unknown",
    error: true,
    error_data: e.message,
    error_code: 500,
  });
}
};
ctr.createSale = async (req, res) => {
  // console.log('test');
  // const { data } = req.body;
try {
  const response = await Cron.appWebhook(req.body);
  res.json({
    response,
    error: false,
  });
} catch (e) {
  res.json({
    message: e.message ? e.message : "error unknown",
    error: true,
    error_data: e.message,
    error_code: 500,
  });
}
};


ctr.getCollectionsProducts = async(req, res) => {
  //Parametros usuario
  console.log("req.body: ",req.body);
  const { id_coleccion } = req.body;
  // console.log("id_coleccion: " + id_coleccion);
  try {
    const products = await Product.collectionWithProducts(id_coleccion);
    res.json({
      products,
      error: false,
    });
  } catch (e) {
    res.json({
      message: e.message ? e.message : "error unknown",
      error: true,
      error_data: e.message,
      error_code: 500,
    });
  }
}

ctr.getCollectionsProducts2 = async(req, res) => {
  //Parametros usuario
  console.log("req.body: test2",req.body);
  const { id_coleccion } = req.body;
  // console.log("id_coleccion: " + id_coleccion);
  try {
      var x=false;
      var respuesta;
      do {
        respuesta = await waitToRequest2(id_coleccion);
        if(respuesta.errors){
          await sleep(4000);
           console.log("como son muchas llamadas esperare un 3 segundos para hacer otra");
           // await new Promise(resolve => setTimeout(resolve, 5000));
           // x++;
        } else {
          //console.log(respuesta);
          respuesta.products = Product._filterProducts(respuesta.products);
          res.json(respuesta)
          x=true;
          // console.log("rompimos el while ");
        }
      }
      while (x==false);
      // console.log("ya mandamos la peticion");
    } catch (err) {
    console.log(err);
      res.json({ auth: false, data: "error al consultar shopify" });

  }
}
async function waitToRequest2(id_coleccion) {


  var elJson;
  try {
      let url = 'https://solbeautyandcare.myshopify.com/admin/api/2020-10/products.json?limit=250&collection_id='+id_coleccion;
      let username = '012bcbb183bf8f415d54d68c58bc9e44';
      let password = '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';
      console.log(url);
      await fetch(url, {
          method:'GET',
          headers: {'Authorization':'Basic ' + base64encode(username + ":" + password)},
          //credentials: 'user:passwd'
         })
      .then(async(response) => await response.json())
      .then(async(json) => {
          elJson = json;
          //console.log(elJson);
      })

      .catch(function(error) {
        console.log('Hubo un problema con la petición Fetch:' + error);
      });

      return elJson;

  } catch (err) {
      return elJson={error:err};

  }

}
module.exports = ctr;    