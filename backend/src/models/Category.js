import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.model("Category", categorySchema);
