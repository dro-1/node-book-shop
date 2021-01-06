const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: {
        required: true,
        type: Object,
      },
      quantity: {
        required: true,
        type: Number,
      },
    },
  ],
  amount: {
    required: true,
    type: Number,
  },
  user: {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
