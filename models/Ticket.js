import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ticketSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open','closed','pending'], default: 'open' },
  replies: [{ by: String, message: String, at: Date }],
  createdAt: { type: Date, default: () => new Date() }
});

export default model('Ticket', ticketSchema);
