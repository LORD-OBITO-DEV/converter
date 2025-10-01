// routes/admin.js
import express from "express";
import User from "../models/User.js";
import { twilioClient } from "../utils/twilio.js"; // ton client Twilio configuré
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Middleware pour vérifier si c'est un admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).send("Accès interdit !");
  }
  next();
};

router.get("/dashboard", isAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const adminsCount = await User.countDocuments({ role: "admin" });
    const numbers = await twilioClient.incomingPhoneNumbers.list({ limit: 5 });

    res.render("admin/dashboard", {
      user: req.user,
      usersCount,
      adminsCount,
      numbers
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

export default router;
