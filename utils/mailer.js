import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendVerificationEmail(to, code) {
  await transporter.sendMail({
    from: `"Numéro Virtuel" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Vérification de votre compte",
    html: `
      <h2>Bienvenue 🎉</h2>
      <p>Voici votre code de vérification :</p>
      <h1 style="color:#0d6efd">${code}</h1>
      <p>Entrez ce code dans l’application pour activer votre compte.</p>
    `
  });
}
