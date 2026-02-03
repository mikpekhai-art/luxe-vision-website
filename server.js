import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// 1. Setup the Transporter using EMAIL_ variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const SIGNATURE_HTML = `
<br><br>
<table style="font-family: Arial, sans-serif; font-size: 14px;">
  <tr>
    <td>
      <strong>Luxe Vision Events</strong><br>
      <span>Event Consultation & Coordinating</span><br>
      <span>Phone: 604-561-4209</span><br>
      <a href="https://luxevisionevents.com">luxevisionevents.com</a>
    </td>
  </tr>
</table>
`;

// 2. The Contact Route (Sends TWO emails)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, eventDate, eventType, package: selectedPackage, vision } = req.body;

    // Email A: Notification to YOU (The Admin)
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

    // Email B: Confirmation to the CLIENT
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
});

// 3. The Vendor Route
app.post('/api/vendor', async (req, res) => {
  try {
    const { contactName, email, phone, businessName, businessType, socials, notes } = req.body;

    // Email A: Notification to Admin
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

    // Email B: Confirmation to Vendor
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
});

const PORT = process.env.NODE_ENV === 'production' ? 5000 : 3001;
const HOST = '0.0.0.0';

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, HOST, () => {
  console.log(`API server running on ${HOST}:${PORT}`);
});