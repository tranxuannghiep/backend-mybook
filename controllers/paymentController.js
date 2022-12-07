const catchAsync = require("../middleware/async");
const PaymentSchema = require("../models/Payment");
const _ = require("lodash");
const { format } = require("date-fns");


exports.payment = catchAsync(async (req, res) => {
    const { name, address, phone, listProducts } = req.body;
    await Promise.all([
        listProducts.forEach(product => {
            PaymentSchema.create({
                name, address, phone, product, status: "transportation", purchaseDate: format(new Date(), "dd/MM/yyy p")
            });
        })
    ])

    res.status(200).json({
        success: true,
    });
});

exports.updatePayment = catchAsync(async (req, res) => {
    const { status, id } = req.body;
    const payment = await PaymentSchema.findByIdAndUpdate(
        id,
        {
            status, deliveryDate: format(new Date(), "dd/MM/yyy p")
        },
        { new: true }
    );

    res.status(200).json({
        success: true,
        data: payment,
    });
});

exports.paymentShip = catchAsync(async (req, res) => {
    const { role, id: userId } = req.user
    const { id, status, limit = 10, page = 1, } = req.body
    const query = {};
    if (role === "seller") {
        query["product.author"] = userId
    }
    if (id) {
        query["product.author"] = id
    }
    if (status) {
        query.status = status
    }

    const data = await PaymentSchema.paginate(query, {
        limit: Number(limit),
        page: Number(page),
    });
    const { docs } = data;
    delete data.docs;
    res.status(200).json({
        success: true,
        data: docs,
        paginate: { ...data },
    });
});


exports.getPaymentSuccess = catchAsync(async (req, res) => {
    const paymentList = await PaymentSchema.find()
    const products = paymentList.filter(product => product.status === "success")
    let listProducts = []
    products.forEach(cart => {
        const idx = listProducts.findIndex(val => val.product.cartId === cart.product.cartId)
        if (idx !== -1) {
            const newProductCopy = _.clone(listProducts[idx])
            newProductCopy.product.quantity = newProductCopy.product.quantity + cart.product.quantity
            listProducts = [...listProducts.slice(0, idx), _.clone(newProductCopy), ...listProducts.slice(idx + 1)]
        }
        else {
            const cartCopy = _.clone(cart)
            listProducts = [...listProducts, cartCopy]
        }
    })

    const topSeller = listProducts.sort((a, b) => -a.product.quantity + b.product.quantity).slice(0, 5)
    const topPrice = listProducts.sort((a, b) => -a.product.quantity * a.product.price + b.product.quantity * b.product.price).slice(0, 5)
    const highPriceList = listProducts.sort((a, b) => -a.product.price + b.product.price).slice(0, 5)
    const lowPriceList = listProducts.sort((a, b) => a.product.price - b.product.price).slice(0, 5)
    const highPrice = highPriceList[0].product.price
    const lowPrice = lowPriceList[0].product.price
    const totalProduct = listProducts.reduce((acc, val) => acc + val.product.quantity * val.product.price, 0)
    const maxQuantity = listProducts.reduce((acc, val) => acc + val.product.quantity, 0)

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