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
  port: parseInt(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 30000
});

// 2. The Contact Route (Sends TWO emails)
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, eventDate, eventType, package: selectedPackage, vision } = req.body;

  // Email A: Notification to YOU (The Admin)
  const adminMailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`, // Shows as "Client Name" via your email
    to: process.env.EMAIL_USER, // Sends to your inbox
    replyTo: email, // So you can hit reply and it goes to the client
    subject: `New Event Inquiry: ${name}`,
    html: `
      <h2>New Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Date:</strong> ${eventDate}</p>
      <p><strong>Package:</strong> ${selectedPackage}</p>
      <p><strong>Vision:</strong><br>${vision}</p>
    `,
  };

  // Email B: Confirmation to the CLIENT
  const clientMailOptions = {
    from: `"Luxe Vision Events" <${process.env.EMAIL_USER}>`,
    to: email, // Sends to the client
    subject: `We received your inquiry!`,
    html: `
      <h2>Hi ${name},</h2>
      <p>Thank you for contacting Luxe Vision Events. We have received your inquiry regarding <strong>${eventType}</strong> on <strong>${eventDate}</strong>.</p>
      <p>We will review your details and get back to you shortly!</p>
      <br>
      <p>Best,</p>
      <p>The Luxe Vision Team</p>
    `,
  };

  try {
    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(clientMailOptions);
    console.log("Emails sent successfully");
    res.json({ success: true, message: 'Inquiry sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send inquiry.' });
  }
});

// 3. The Vendor Route (Optional - keeping your existing logic)
app.post('/api/vendor', async (req, res) => {
  const { contactName, email, phone, businessName, businessType, socials, notes } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Vendor Application: ${businessName}`,
    html: `
      <h2>New Vendor Application</h2>
      <p><strong>Contact:</strong> ${contactName}</p>
      <p><strong>Business:</strong> ${businessName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Notes:</strong> ${notes}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Application submitted!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit.' });
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