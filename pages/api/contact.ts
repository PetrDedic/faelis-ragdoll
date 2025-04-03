import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metoda není povolena" });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `Nový kontaktní formulář od ${name}`,
      html: `
        <h2>Nový kontaktní formulář</h2>
        <p><strong>Jméno:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Předmět:</strong> ${subject}</p>
        <p><strong>Zpráva:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "E-mail byl úspěšně odeslán" });
  } catch (error) {
    console.error("Chyba při odesílání e-mailu:", error);
    return res.status(500).json({ error: "Nepodařilo se odeslat e-mail" });
  }
}
