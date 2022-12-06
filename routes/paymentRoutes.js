const express = require("express");
const { payment, getPaymentAll, shipping } = require("../controllers/paymentController");

const { jwtAuthAdmin, jwtAuth } = require("../middleware/jwtAuth");


const router = express.Router();

router.post("", jwtAuth, payment);
router.get("", jwtAuthAdmin, getPaymentAll);
router.post("/ship/:id", jwtAuth, shipping);



module.exports = router;
