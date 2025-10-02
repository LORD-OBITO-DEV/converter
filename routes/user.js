// routes/user.js
import express from "express";
import { twilioClient } from "../utils/twilio.js";
import User from "../models/User.js";

const router = express.Router();

// Middleware authentification simple
const isUser = (req, res, next) => {
  if (!req.user) return res.status(401).send("Non autorisé !");
  next();
};

router.get("/dashboard", isUser, async (req, res) => {
  try {
    // Récupère son profil
    const user = await User.findById(req.user._id);

    // (plus tard on lie les numéros achetés par user)
    const boughtNumbers = []; 

    res.render("user/dashboard", {
      user,
      boughtNumbers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

export default router;
