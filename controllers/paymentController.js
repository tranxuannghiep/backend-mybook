const catchAsync = require("../middleware/async");
const PaymentSchema = require("../models/Payment");


exports.payment = catchAsync(async (req, res) => {
    const { name, address, phone, totalPrice, listProducts } = req.body;
    const payment = await PaymentSchema.create({
        name, address, phone, totalPrice, listProducts
    });

    res.status(200).json({
        success: true,
        data: payment,
    });
});

