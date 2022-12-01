const express = require("express");
const { payment, getPaymentAll } = require("../controllers/paymentController");

const { jwtAuthAdmin, jwtAuth } = require("../middleware/jwtAuth");


const router = express.Router();

router.post("/payment", jwtAuth, payment);
router.get("/payment", jwtAuthAdmin, getPaymentAll);



module.exports = router;
