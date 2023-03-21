const express = require("express");
const router = express.Router();
const ProductController = require("../controller/app/ProductsController");
const TestingController = require("../controller/app/TestController");
const CouponController = require("../controller/app/CouponController");

router.get("/feed", ProductController.getFeed);
router.post('/createSale', TestingController.createSale);
router.get("/test/burncash/:email/:spent/:total", TestingController.burncash);

router.get("/coupons", CouponController.validate);

router.get("/burncash", TestingController.burncash);
router.post('/getCollectionsProducts', TestingController.getCollectionsProducts2);//obtener todos los productos de una coleccion

module.exports = router;
