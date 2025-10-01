import express from "express";
const router = express.Router();

router.post("/sms",(req,res)=>{
  const {From,To,Body} = req.body;
  console.log(`SMS reçu de ${From} vers ${To}: ${Body}`);
  res.send("<Response></Response>");
});

export default router;
