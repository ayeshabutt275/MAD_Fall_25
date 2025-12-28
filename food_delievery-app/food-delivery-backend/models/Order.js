const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      category: String,
    },
  ],
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "cash" },
  status: {
    type: String,
    enum: ["pending", "preparing", "on-the-way", "delivered", "cancelled"],
    default: "pending",
  },
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
