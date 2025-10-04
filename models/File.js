import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const fileSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  originalUrl: { type: String },
  filename: { type: String, required: true },
  mime: { type: String },
  size: { type: Number },
  public: { type: Boolean, default: true },
  createdAt: { type: Date, default: () => new Date() }
});

export default model('File', fileSchema);
