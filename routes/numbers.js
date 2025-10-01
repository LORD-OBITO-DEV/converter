import express from "express";
import twilio from "twilio";
import Number from "../models/Number.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

const router = express.Router();
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

router.get("/search", async(req,res)=>{
  const {country} = req.query;
  const numbers = await client.availablePhoneNumbers(country).local.list({limit:5});
  res.json(numbers);
});

router.post("/buy", async(req,res)=>{
  const {phoneNumber,userId} = req.body;
  const user = await User.findById(userId);
  if(!user || !user.paymentVerified) return res.status(403).json({message:"Paiement non validé"});
  const bought = await client.incomingPhoneNumbers.create({phoneNumber,smsUrl:process.env.BASE_URL+"/webhooks/sms"});
  const number = new Number({sid:bought.sid,phoneNumber:bought.phoneNumber,userId});
  await number.save();
  const order = new Order({userId,numberId:number._id,amount:500,status:"paid"});
  await order.save();
  res.json({message:"Numéro acheté",number,order});
});

export default router;
