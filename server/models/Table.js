const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
  tableNumber: Number,
  status: { type: String, enum: ["free", "waiting for food", "eating"], default: "free" },
  eatingStartTime: {
    type: Date,
    default: null, // Will be set when status is 'eating'
  },
});

module.exports = mongoose.model("Table", TableSchema);
