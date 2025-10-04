import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import File from "../models/File.js";

const router = express.Router();

// Liste des utilisateurs
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  const users = await User.find({}, "-password");
  res.json({ users });
});

// Supprimer un utilisateur
router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Tickets support
router.get("/tickets", authMiddleware, adminMiddleware, async (req, res) => {
  const tickets = await Ticket.find().populate("user", "email name");
  res.json({ tickets });
});

// Répondre à un ticket
router.post("/tickets/:id/reply", authMiddleware, adminMiddleware, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ error: "Not found" });
  ticket.replies.push({ fromAdmin: true, message: req.body.message });
  await ticket.save();
  res.json({ success: true });
});

// Fichiers
router.get("/files", authMiddleware, adminMiddleware, async (req, res) => {
  const files = await File.find();
  res.json({ files });
});

router.delete("/files/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await File.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
