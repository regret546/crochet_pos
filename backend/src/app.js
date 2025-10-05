const express = require("express");
const cors = require("cors");

const saleRoutes = require("./routes/saleRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json()); // allows reading req.body (JSON)

app.use("/api/sales", saleRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
