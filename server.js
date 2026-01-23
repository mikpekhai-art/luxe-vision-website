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

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

app.post('/api/contact', async (req, res) => {
  const { name, eventDate, eventType, package: selectedPackage, vision } = req.body;
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_TO_EMAIL,
    subject: `New Event Inquiry from ${name}`,
    html: `
      <h2>New Event Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Event Date:</strong> ${eventDate}</p>
      <p><strong>Event Type:</strong> ${eventType}</p>
      <p><strong>Interested Package:</strong> ${selectedPackage}</p>
      <p><strong>Vision/Details:</strong></p>
      <p>${vision}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Inquiry sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send inquiry. Please try again.' });
  }
});

app.post('/api/vendor', async (req, res) => {
  const { contactName, businessName, businessType, socials, notes } = req.body;
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_TO_EMAIL,
    subject: `New Vendor Application: ${businessName}`,
    html: `
      <h2>New Vendor Application</h2>
      <p><strong>Contact Name:</strong> ${contactName}</p>
      <p><strong>Business Name:</strong> ${businessName}</p>
      <p><strong>Business Type:</strong> ${businessType}</p>
      <p><strong>Socials/Contact:</strong> ${socials}</p>
      <p><strong>Notes:</strong></p>
      <p>${notes}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application. Please try again.' });
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
