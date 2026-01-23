# Luxe Vision

## Overview
Luxe Vision is an event consultation and coordinating website built with React and Vite, featuring email form submissions via Nodemailer.

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
Form submissions are sent to booking@luxevisionevents.com via SMTP.

Environment variables required:
- SMTP_HOST: mail.luxevisionevents.com
- SMTP_PORT: 465
- SMTP_USER: booking@luxevisionevents.com
- SMTP_PASSWORD: (stored as secret)
- SMTP_TO_EMAIL: booking@luxevisionevents.com

## API Endpoints
- POST /api/contact - Submit event inquiry form
- POST /api/vendor - Submit vendor application form
