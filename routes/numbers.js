import express from "express";
import twilio from "twilio";
import Number from "../models/Number.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

const router = express.Router();
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Rechercher numéros disponibles
router.get("/search", async (req, res) => {
  const { country } = req.query;
  try {
    const numbers = await client.availablePhoneNumbers(country).local.list({ limit: 5 });
    res.json(numbers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Acheter un numéro
router.post("/buy", async (req, res) => {
  const { phoneNumber, userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || !user.paymentVerified) return res.status(403).json({ message: "Paiement non validé" });

    const bought = await client.incomingPhoneNumbers.create({
      phoneNumber,
      smsUrl: process.env.BASE_URL + "/webhooks/sms"
    });

    const number = new Number({
      sid: bought.sid,
      phoneNumber: bought.phoneNumber,
      userId
    });
    await number.save();

    const order = new Order({
      userId,
      numberId: number._id,
      amount: 500, // Exemple montant
      status: "paid"
    });
    await order.save();

    res.json({ message: "Numéro acheté", number, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
