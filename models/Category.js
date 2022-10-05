const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
  },
  {
    collection: "categories",
    timestamps: true,
  }
);

mongoose.set("runValidators", true);

const CategorySchema = mongoose.model("Category", categorySchema);
module.exports = CategorySchema;
