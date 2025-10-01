import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/mailer.js";
import { createVerificationPayment } from "../utils/payment.js";

const router = express.Router();

// Signup
router.post("/signup", async(req,res)=>{
  const {name,email,password,phone} = req.body;
  try{
    const exist = await User.findOne({email});
    if(exist) return res.status(400).json({message:"Email déjà utilisé"});
    const hashed = await bcrypt.hash(password,10);
    const code = Math.floor(100000 + Math.random()*900000).toString();
    const user = new User({name,email,password:hashed,verificationCode:code});
    await user.save();
    await sendVerificationEmail(email,code);
    const paymentUrl = await createVerificationPayment(user._id, phone);
    res.json({message:"Compte créé, vérifiez email et paiement 1€", paymentUrl});
  }catch(err){ res.status(500).json({error:err.message}); }
});

// Verify email
router.post("/verify-email", async(req,res)=>{
  const {email,code} = req.body;
  const user = await User.findOne({email});
  if(!user) return res.status(404).json({message:"Utilisateur introuvable"});
  if(user.verificationCode!==code) return res.status(400).json({message:"Code incorrect"});
  user.verified = true;
  user.verificationCode = null;
  await user.save();
  res.json({message:"✅ Email vérifié"});
});

// Login
router.post("/login", async(req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user) return res.status(404).json({message:"Utilisateur introuvable"});
  const match = await bcrypt.compare(password,user.password);
  if(!match) return res.status(400).json({message:"Mot de passe incorrect"});
  if(!user.verified) return res.status(403).json({message:"Compte non vérifié"});
  if(!user.paymentVerified) return res.status(403).json({message:"Paiement non validé"});
  const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
  res.json({message:"Connexion réussie",token});
});

export default router;
