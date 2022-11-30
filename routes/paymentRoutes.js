const express = require("express");
const { payment, getPaymentAll } = require("../controllers/paymentController");

const { jwtAuthAdmin } = require("../middleware/jwtAuth");


const router = express.Router();

router.post("/payment", jwtAuthAdmin, payment);
router.get("/payment", jwtAuthAdmin, getPaymentAll);



module.exports = router;
