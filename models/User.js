const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { ROLELIST } = require("../constants");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      validate: [validator.isEmail, "Email is invalid"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "Must be at least 6 characters"],
      maxlength: [30, "Must be at less than 30 characters"],
    },
    role: {
      type: String,
      enum: ROLELIST,
      default: ROLELIST.GUEST,
    },
    age: {
      type: Number,
      required: [true, "age is required"],
    },
    gender: {
      type: String,
      required: [true, "gender is required"],
    },
    image: {
      type: String,
    },
  },
  {
    collection: "users",
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    const salt = bcrypt.genSaltSync();
    const hashPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashPassword;
    next();
  }
});

userSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "author",
});
userSchema.plugin(mongoosePaginate);
const UserSchema = mongoose.model("User", userSchema);
module.exports = UserSchema;
