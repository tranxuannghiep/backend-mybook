const express = require("express");
const { payment, getPaymentAll } = require("../controllers/paymentController");

const { jwtAuth } = require("../middleware/jwtAuth");


const router = express.Router();

router.post("/payment", payment);
router.get("/payment", getPaymentAll);



module.exports = router;
