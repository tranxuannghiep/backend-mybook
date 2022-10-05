const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    image: [String],
  },
  {
    collection: "books",
    timestamps: true,
  }
);

mongoose.set("runValidators", true);
bookSchema.plugin(mongoosePaginate);
const BookSchema = mongoose.model("Book", bookSchema);
module.exports = BookSchema;
