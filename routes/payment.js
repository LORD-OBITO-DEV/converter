import express from "express";
import User from "../models/User.js";
import { createVerificationPayment } from "../utils/payment.js";

const router = express.Router();

// Crée une session paiement 1€
router.post("/create", async (req, res) => {
  const { userId, phone } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const paymentUrl = await createVerificationPayment(userId, phone);
    res.json({ message: "Session de paiement créée", paymentUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook CinetPay pour valider le paiement
router.post("/webhook", async (req, res) => {
  const { transaction_id, status, metadata } = req.body;

  try {
    if (status === "ACCEPTED") {
      const userId = metadata.userId;
      const user = await User.findById(userId);
      if (user) {
        user.paymentVerified = true; // Active le paiement
        await user.save();
      }
    }
    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
