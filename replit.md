# Luxe Vision

## Overview
Luxe Vision is a React-based web application built with Vite and styled with Tailwind CSS.

## Project Architecture
- **Frontend Framework**: React 19
- **Build Tool**: Vite (via rolldown-vite)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

## Project Structure
```
├── public/           # Static assets
├── src/
│   ├── assets/       # App assets
│   ├── App.jsx       # Main app component
│   ├── App.css       # App styles
│   ├── main.jsx      # Entry point
│   └── index.css     # Global styles
├── index.html        # HTML entry point
├── vite.config.js    # Vite configuration
├── tailwind.config.js # Tailwind configuration
└── postcss.config.js  # PostCSS configuration
```

## Development
- Run `npm run dev` to start the development server on port 5000
- Run `npm run build` to build for production
- Run `npm run preview` to preview production build

## Configuration
- Vite is configured to run on host 0.0.0.0:5000 with all hosts allowed for Replit proxy compatibility
