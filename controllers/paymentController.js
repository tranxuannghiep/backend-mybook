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


exports.getPaymentAll = catchAsync(async (req, res) => {
    const paymentList = await PaymentSchema.find()
    const listCart = paymentList.map(product => product.listProducts).flat()
    let listProducts = []
    listCart.forEach(cart => {
        const idx = listProducts.findIndex(val => val.cartId === cart.cartId)
        if (idx !== -1) {
            listProducts = [...listProducts.slice(0, idx), { ...listProducts[idx], quantity: listProducts[idx].quantity + cart.quantity }, ...listProducts.slice(idx + 1)]
        }
        else {
            listProducts = [...listProducts, { ...cart }]
        }
    })

    const topSeller = listProducts.sort((a, b) => -a.quantity + b.quantity).slice(0, 5)
    const topPrice = listProducts.sort((a, b) => -a.quantity * a.price + b.quantity * b.price).slice(0, 5)

    res.status(200).json({
        success: true,
        data: {
            topSeller,
            topPrice
        },
    });
});