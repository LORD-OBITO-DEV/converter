import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payment.js";
import numbersRoutes from "./routes/numbers.js";
import webhooksRoutes from "./routes/webhooks.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("✅ Connecté à MongoDB"))
  .catch(err=>console.error("❌ Erreur MongoDB:",err));

app.use("/auth", authRoutes);
app.use("/payment", paymentRoutes);
app.use("/numbers", numbersRoutes);
app.use("/webhooks", webhooksRoutes);

app.listen(process.env.PORT, ()=>console.log(`🚀 Serveur sur http://localhost:${process.env.PORT}`));
