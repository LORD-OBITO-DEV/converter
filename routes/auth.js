import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/mailer.js";

const router = express.Router();

// Inscription
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Vérifier si email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    // Hash mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Code vérification
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationCode
    });

    await user.save();

    // Envoi email
    await sendVerificationEmail(email, verificationCode);

    res.json({ message: "Compte créé. Vérifiez votre email pour le code." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vérification email
router.post("/verify-email", async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    if (user.verificationCode !== code)
      return res.status(400).json({ message: "Code incorrect" });

    user.verified = true;
    user.verificationCode = null;
    await user.save();

    res.json({ message: "✅ Email vérifié avec succès !" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    if (!user.verified) return res.status(403).json({ message: "Compte non vérifié" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Connexion réussie", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
