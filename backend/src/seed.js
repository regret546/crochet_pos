const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

const Category = require("./models/Category.js");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const seedData = async () => {
  try {
    /*  For category seed */
    const categories = [
      { name: "Yarn" },
      { name: "Hooks" },
      { name: "Patterns" },
      { name: "Accessories" },
    ];

    // 🧹 Clear existing
    await Category.deleteMany();

    // 🌾 Insert new
    await Category.insertMany(categories);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
