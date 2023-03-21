const Rep = require("../../repositories/Product");

var ctr = {};

ctr.getProductId = async (req, res)=> {
  try {
    const id = req.params.id ? req.params.id : null;
    const resp = await Rep.getProductById(id);
    res.json(resp);
  } catch (e) {
    res.json({
      message: "error unknown",
      error: true,
      error_data: e.message,
      error_code: 500,
    });
  }
  return {};
}

ctr.getProducts  = async (req, res) => {
  try {
    const resp = await Rep.getProducts();
    res.json(resp);
  } catch (e) {
    res.json({
      message: "error unknown",
      error: true,
      error_data: e.message,
      error_code: 500,
    });
  }
  return {};
}
ctr.getFeed  = async (req, res) => {
  try {
    const resp = await Rep.getFeed();
    res.json(resp);
  } catch (e) {
    res.json({
      message: "error unknown",
      error: true,
      error_data: e.message,
      error_code: 500,
    });
  }
  return {};
}

ctr.getCollectionsProducts = async(req, res) => {
  //Parametros usuario
  console.log("req.body: ",req.body);
  const { id_coleccion } = req.body;
  try {
    const products = await Rep.collectionWithProducts(id_coleccion);
    res.json({products});
  } catch (e) {
    res.json({
      message: e.message ? e.message : "error unknown",
      error: true,
      error_data: e.message,
      error_code: 500,
    });
  }
}

module.exports = ctr;
