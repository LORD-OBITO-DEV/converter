import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT||587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

export async function sendWelcome(email, name){
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Bienvenue sur Convertisseur',
    text: `Salut ${name||''}, bienvenue sur Convertisseur !`,
    html: `<p>Salut <b>${name||''}</b>, bienvenue sur <i>Convertisseur</i> !</p>`
  });
    }
