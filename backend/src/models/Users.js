const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
