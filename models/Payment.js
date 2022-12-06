const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },
        address: {
            type: String,
            required: [true, "address is required"],
        },
        phone: {
            type: String,
            required: [true, "phone is required"],
        },
        totalPrice: {
            type: String,
        },
        listProducts: {
            type: [Object],
        },
        status: {
            type: String
        }
    },
    {
        collection: "payment",
        timestamps: true,
    }
);

mongoose.set("runValidators", true);
paymentSchema.plugin(mongoosePaginate);
const PaymentSchema = mongoose.model("Payment", paymentSchema);
module.exports = PaymentSchema;
