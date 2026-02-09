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
    const { contactName, email, phone, businessName, businessType, socials, notes } = req.body;

    await transporter.sendMail({
      from: `"Luxe Vision Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Vendor Application: ${businessName}`,
      html: `
        <h2>New Vendor Application</h2>
        <p><strong>Contact Name:</strong> ${contactName}</p>
        <p><strong>Business Name:</strong> ${businessName}</p>
        <p><strong>Business Type:</strong> ${businessType}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Socials:</strong> ${socials}</p>
        <p><strong>Notes:</strong><br>${notes}</p>
      `,
    });

    await transporter.sendMail({
      from: `"Luxe Vision Events" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Vendor Application Received",
      html: `
        <p>Hi ${contactName},</p>
        <p>Thank you for your interest in partnering with Luxe Vision Events! We've received your vendor application and will review it shortly.</p>
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
