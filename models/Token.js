const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    token: {
      type: String,
    },
  },
  {
    collection: "tokens",
    timestamps: true,
  }
);

tokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: +process.env.TOKEN_EXPIRED }
);

const TokenSchema = mongoose.model("Token", tokenSchema);
module.exports = TokenSchema;
