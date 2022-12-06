const catchAsync = require("../middleware/async");
const PaymentSchema = require("../models/Payment");


exports.payment = catchAsync(async (req, res) => {
    const { name, address, phone, totalPrice, listProducts } = req.body;
    const payment = await PaymentSchema.create({
        name, address, phone, totalPrice, listProducts, status: "transportation"
    });

    res.status(200).json({
        success: true,
        data: payment,
    });
});

exports.shipping = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const payment = await PaymentSchema.findByIdAndUpdate(
        id,
        {
            status
        },
        { new: true }
    );

    res.status(200).json({
        success: true,
        data: payment,
    });
});


exports.getPaymentAll = catchAsync(async (req, res) => {
    const paymentList = await PaymentSchema.find()
    const listCart = paymentList.filter(product => product.status === "success").map(product => product.listProducts).flat()
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
    const highPriceList = listProducts.sort((a, b) => -a.price + b.price).slice(0, 5)
    const lowPriceList = listProducts.sort((a, b) => a.price - b.price).slice(0, 5)
    const highPrice = highPriceList[0].price
    const lowPrice = lowPriceList[0].price
    const totalProduct = listProducts.reduce((acc, val) => acc + val.quantity * val.price, 0)
    const maxQuantity = listProducts.reduce((acc, val) => acc + val.quantity, 0)

    res.status(200).json({
        success: true,
        data: {
            topSeller,
            topPrice,
            highPriceList,
            lowPriceList,
            highPrice,
            lowPrice,
            totalProduct,
            maxQuantity
        },
    });
});