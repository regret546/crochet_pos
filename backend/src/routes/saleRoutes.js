const express = require("express");
const router = express.Router();
const Sale = require("../models/Sales");
const upload = require("../middleware/uploadMiddleware");

// @desc   Get all sales
// @route  GET /api/sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });
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
    const sales = await Sale.findById(req.params.id).populate(
      "category",
      "name"
    );
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
router.post("/", upload.single("picture"), async (req, res) => {
  const { itemName, quantity, price, category } = req.body;
  const numQuantity = Number(quantity);
  const numPrice = Number(price);
  const total = numQuantity * numPrice;
  
  // Get picture path if file was uploaded
  const picture = req.file ? `/uploads/${req.file.filename}` : "";

  try {
    const sale = new Sale({ 
      itemName, 
      quantity: numQuantity, 
      price: numPrice, 
      total, 
      category, 
      picture 
    });
    const saveSale = await sale.save();
    res.status(201).json(saveSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc   Update a sale
// @route  PUT /api/sales/:id
router.put("/:id", upload.single("picture"), async (req, res) => {
  try {
    const { itemName, quantity, price, category } = req.body;
    const numQuantity = Number(quantity);
    const numPrice = Number(price);
    const total = numQuantity * numPrice;
    
    // Prepare update data
    const updateData = { 
      itemName, 
      quantity: numQuantity, 
      price: numPrice, 
      total, 
      category 
    };
    
    // If a new picture is uploaded, update the picture field
    if (req.file) {
      updateData.picture = `/uploads/${req.file.filename}`;
    }
    
    const updateSale = await Sale.findByIdAndUpdate(
      req.params.id,
      updateData,
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
