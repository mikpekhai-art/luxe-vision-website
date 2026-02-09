import nodemailer from 'nodemailer';

const SIGNATURE_HTML = `
<br><br>
<table style="font-family: Arial, sans-serif; font-size: 14px;">
  <tr>
    <td>
      <strong>Luxe Vision Events</strong><br>
      <span>Event Consultation & Coordinating</span><br>
      <span>Phone: 604-561-4209</span>
    </td>
  </tr>
</table>
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  try {
    const { name, email, phone, eventDate, eventType, package: selectedPackage, vision } = req.body;

    await transporter.sendMail({
      from: `"Luxe Vision Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Inquiry from ${name}`,
      html: `
        <h2>New Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Event Date:</strong> ${eventDate}</p>
        <p><strong>Event Type:</strong> ${eventType}</p>
        <p><strong>Interested Package:</strong> ${selectedPackage}</p>
        <p><strong>Vision:</strong><br>${vision}</p>
      `,
    });

    await transporter.sendMail({
      from: `"Luxe Vision Events" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We've Received Your Request!",
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for contacting Luxe Vision Events! We've received your inquiry and will get back to you within 24 hours.</p>
        <p>Best regards,<br>The Luxe Vision Team</p>
        ${SIGNATURE_HTML}
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
