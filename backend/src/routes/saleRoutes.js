const express = require("express");
const router = express.Router();
const Sale = require("../models/Sales");

// @desc   Get all sales
// @route  GET /api/sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    if (!sales) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc   Get specific new sale
// @route   POST /api/sales/:id

router.get("/:id", async (req, res) => {
  try {
    const sales = await Sale.findById(req.params.id);
    if (!sales) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc   Add new sale
// @route  POST /api/sales
router.post("/", async (req, res) => {
  const { itemName, quantity, price } = req.body;
  const total = quantity * price;

  try {
    const sale = new Sale({ itemName, quantity, price, total });
    const saveSale = await sale.save();
    res.status(201).json(saveSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc   Update a sale
// @route  PUT /api/sales/:id

router.put("/:id", async (req, res) => {
  console.log("🟡 Update request:", req.params.id, req.body);
  try {
    const { itemName, quantity, price } = req.body;
    const total = quantity * price;
    const updateSale = await Sale.findByIdAndUpdate(
      req.params.id,
      { itemName, quantity, price, total },
      { new: true }
    );
    if (!updateSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(updateSale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc   Delete a sale
// @route  DELETE /api/sales/:id
router.delete("/:id", async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(400).json({ message: "Sale not found" });
    res.json({ message: "Sales deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
