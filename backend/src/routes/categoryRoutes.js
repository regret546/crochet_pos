const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// @desc   Get all sales
// @route  GET /api/category
router.get("/", async (req, res) => {
  try {
    const category = await Category.find().sort({ createAt: -1 });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc   Add new category
// @route  POST /api/category
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const category = new Category({ name });
    const saveCategory = await category.save();
    res.status(201).json(saveCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc   Update a category
// @route  PUT /api/category/:id
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const updateCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updateCategory) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.json(updateCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc   Delete a category
// @route  DELETE /api/category/:id
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(400).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
