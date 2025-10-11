const mongoose = require("mongoose");
const { Schema } = mongoose;

const saleSchema = Schema(
  {
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Cagetegory",
    },
  },
  { timestamps: true } //add createAt and updatedAt
);

module.exports = mongoose.model("Sale", saleSchema);
