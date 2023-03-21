const express = require("express");
const router = express.Router();
const InventoryController = require("../controller/app/InventoryController");

router.get("/hello",  InventoryController.hello);
router.post("/set-products-barcodes", InventoryController.barcode)

module.exports = router;
