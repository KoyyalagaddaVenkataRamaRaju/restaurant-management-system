const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  tableNumber: Number,
  items: [{ name: String, price: Number, quantity: Number }],
  status: { type: String, enum: ["pending", "prepared"], default: "pending" },
  totalPrice: Number,
});

module.exports = mongoose.model("Order", OrderSchema);
