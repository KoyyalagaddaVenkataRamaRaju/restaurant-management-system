const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    tableNumber: Number,
    itemId: String,
    name: String,
    imageUrl: String,
    price: Number,
    quantity: Number,
});

module.exports = mongoose.model("Cart", CartSchema);
