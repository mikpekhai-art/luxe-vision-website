# Luxe Vision

## Overview
Luxe Vision is an event consultation and coordinating website built with React and Vite, featuring email form submissions via Nodemailer using cPanel-hosted email.

## Project Architecture
- **Frontend Framework**: React 19
- **Build Tool**: Vite (via rolldown-vite)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Backend**: Express.js with Nodemailer for email functionality

## Project Structure
```
├── public/           # Static assets
├── src/
│   ├── assets/       # App assets
│   ├── App.jsx       # Main app component
│   ├── App.css       # App styles
│   ├── main.jsx      # Entry point
│   └── index.css     # Global styles
├── server.js         # Express backend for email
├── index.html        # HTML entry point
├── vite.config.js    # Vite configuration
├── tailwind.config.js # Tailwind configuration
└── postcss.config.js  # PostCSS configuration
```

## Development
- Run `npm run dev` to start the frontend on port 5000
- Run `npm run server` to start the API server on port 3001
- Run `npm run build` to build for production

## Email Configuration
Uses cPanel-hosted email via Nodemailer (same pattern as visionfly project).
Sends dual emails: admin notification + client confirmation.

Secrets required (stored in Replit Secrets):
- EMAIL_HOST: cPanel mail server hostname (mail.luxevisionevents.com)
- EMAIL_USER: info@luxevisionevents.com
- EMAIL_PASS: cPanel email password
- EMAIL_PORT: 465

## API Endpoints
- POST /api/contact - Submit event inquiry form (sends admin notification + client confirmation)
- POST /api/vendor - Submit vendor application form (sends admin notification + vendor confirmation)

## User Preferences
- Email system follows the same cPanel SMTP pattern used in the visionfly project
- Both forms collect: name, email, phone number, and relevant details
- All emails sent from info@luxevisionevents.com
