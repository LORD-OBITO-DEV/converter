import axios from "axios";

export async function createVerificationPayment(userId, phone){
  const response = await axios.post("https://api-checkout.cinetpay.com/v2/payment",{
    apikey:process.env.CINETPAY_API_KEY,
    site_id:process.env.CINETPAY_SITE_ID,
    transaction_id:`verify-${userId}-${Date.now()}`,
    amount:655,
    currency:"XOF",
    description:"Vérification paiement",
    customer_phone_number:phone,
    notify_url:process.env.BASE_URL+"/payment/webhook"
  });
  return response.data.data.payment_url;
}
