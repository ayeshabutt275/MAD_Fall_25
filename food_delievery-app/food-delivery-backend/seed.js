const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Food = require("./models/Food");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const foods = [
  {
    name: "BBQ Chicken Pizza",
    price: 1200,
    category: "Pizza",
    image: "http://192.168.0.126:5000/images/bbq_chicken_pizza.jpg"
  },
  {
    name: "Beef Burger",
    price: 450,
    category: "Burger",
    image: "http://192.168.0.126:5000/images/beef_burger.jpg"
  },
  {
    name: "Chicken Roll Paratha",
    price: 300,
    category: "Roll",
    image: "http://192.168.0.126:5000/images/chicken_roll_paratha.jpg"
  },
  {
    name: "Chicken Shawarma",
    price: 350,
    category: "Wrap",
    image: "http://192.168.0.126:5000/images/chicken_shawarma.jpg"
  },
  {
    name: "Chocolate Lava Cake",
    price: 400,
    category: "Dessert",
    image: "http://192.168.0.126:5000/images/chocolate_lava_cake.jpg"
  },
  {
    name: "Double Zinger Burger",
    price: 650,
    category: "Burger",
    image: "http://192.168.0.126:5000/images/double_zinger_burger.jpg"
  },
  {
    name: "Fajita Pizza",
    price: 1100,
    category: "Pizza",
    image: "http://192.168.0.126:5000/images/fajita_pizza.jpg"
  },
  {
    name: "French Fries (Large)",
    price: 250,
    category: "Fries",
    image: "http://192.168.0.126:5000/images/french_fries_large.jpg"
  },
  {
    name: "Loaded Fries",
    price: 450,
    category: "Fries",
    image: "http://192.168.0.126:5000/images/loaded_fries.jpg"
  },
  {
    name: "Mineral Water",
    price: 80,
    category: "Drink",
    image: "http://192.168.0.126:5000/images/mineral_water.jpg"
  },
  {
    name: "Pepperoni Pizza",
    price: 1150,
    category: "Pizza",
    image: "http://192.168.0.126:5000/images/pepperoni_pizza.jpg"
  },
  {
    name: "Soft Drink",
    price: 120,
    category: "Drink",
    image: "http://192.168.0.126:5000/images/soft_drink.jpg"
  },
  {
    name: "Tikka Pizza",
    price: 1100,
    category: "Pizza",
    image: "http://192.168.0.126:5000/images/tikka_pizza.jpg"
  },
  {
    name: "Zinger Burger",
    price: 550,
    category: "Burger",
    image: "http://192.168.0.126:5000/images/zinger_burger.jpg"
  },
  {
    name: "Ice Cream Sundae",
    price: 300,
    category: "Dessert",
    image: "http://192.168.0.126:5000/images/ice_cream_sundae.jpg"
  }
];

const seedData = async () => {
  await Food.deleteMany();
  await Food.insertMany(foods);
  console.log("✅ Food items with images seeded");
  process.exit();
};

seedData();