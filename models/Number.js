import mongoose from "mongoose";

const numberSchema = new mongoose.Schema({
  sid: String,
  phoneNumber: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  status: { type: String, enum:["active","inactive"], default:"active" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Number", numberSchema);
