import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  numberId: { type: mongoose.Schema.Types.ObjectId, ref:"Number" },
  amount: Number,
  status: { type: String, enum:["pending","paid","failed"], default:"pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
