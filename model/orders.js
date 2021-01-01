const mongoose = require("mongoose");

const OrdersShcema = new mongoose.Schema({
  products: [
    {
      pName: { type: String, required: true },
      qty: { type: Number, required: true },
      pId: { type: mongoose.Schema.ObjectId },
    },
  ],
  user: {
    userId: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

const orders = mongoose.model("orders", OrdersShcema);

module.exports = orders;
