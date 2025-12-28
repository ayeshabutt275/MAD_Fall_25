const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String   // 👈 image URL
});

module.exports = mongoose.model("Food", foodSchema);