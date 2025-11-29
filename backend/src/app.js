const express = require("express");
const cors = require("cors");

const saleRoutes = require("./routes/saleRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

app.use(cors());
app.use(express.json()); // allows reading req.body (JSON)
app.use("/uploads", express.static("uploads")); // Serve uploaded files

app.use("/api/sales", saleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);

module.exports = app;
