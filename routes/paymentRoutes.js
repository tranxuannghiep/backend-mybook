const express = require("express");
const { payment, getPaymentSuccess, updatePayment, paymentShip } = require("../controllers/paymentController");

const { jwtAuthAdmin, jwtAuth } = require("../middleware/jwtAuth");


const router = express.Router();

router.post("", jwtAuth, payment);
router.get("", jwtAuth, getPaymentSuccess);
router.post("/ship", jwtAuth, updatePayment);
router.post("/shipping", jwtAuth, paymentShip);



module.exports = router;
