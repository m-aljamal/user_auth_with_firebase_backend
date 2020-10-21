const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      max: 32,
      lowercase: true,
      index: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    picture: {
      type: String,
    },
    cart: {
      type: Array,
      default: [],
    },
    address: String,
    // wishlist: [{ type: ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("User", userSchema);
