const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const Sales = require("./models/Sales.js");
const Users = require("./models/Users.js");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const seedData = async () => {
  try {
    // Clear existing data
    await Sales.deleteMany();
    await Users.deleteMany();

    // Dummy sales
    const sales = [
      { itemName: "Crochet Hat", quantity: 2, price: 150, total: 300 },
      { itemName: "Crochet Bag", quantity: 1, price: 500, total: 500 },
      { itemName: "Keychain", quantity: 5, price: 50, total: 250 },
    ];

    // Insert sales
    await Sales.insertMany(sales);
    console.log("✅ Sales data seeded");

    // Dummy admin user
    const adminUser = {
      username: "admin",
      password: "1234", // (we’ll hash later)
    };

    await Users.create(adminUser);
    console.log("✅ Admin user created (username: admin, password: 1234)");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
