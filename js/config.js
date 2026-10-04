/**
 * SITE_CONFIG
 * -----------
 * Single source of truth for anything you might want to tweak without
 * touching the page markup: colors, fonts, key dates, which sections
 * are visible, and where the RSVP form sends its data.
 *
 * You can edit this file by hand, or open /admin/index.html locally
 * (never publish that folder) for a small visual editor that generates
 * an updated version of this file for you to paste back in.
 */
window.SITE_CONFIG = {
  couple: {
    name1: "Kika",
    name2: "Miguel"
  },

  // ISO date/time of the ceremony — drives the homepage countdown.
  weddingDateTime: "2027-01-23T12:30:00",

  // After this moment, the RSVP form is replaced with "Respostas fechadas".
  rsvpDeadline: "2026-11-30T23:59:59",

  // Paste the URL you get after deploying backend/Code.gs as a Web App.
  // It looks like: https://script.google.com/macros/s/AKfycb.../exec
  rsvpEndpoint: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",

  theme: {
    colors: {
      ink: "#1C2321",
      paper: "#EEECE3",
      paperAlt: "#E4E1D5",
      accent: "#38493B",
      accent2: "#A68A5B"
    },
    fonts: {
      display: "'Instrument Serif', serif",
      body: "'Work Sans', sans-serif"
    }
  },

  // Toggle whole sections on/off without deleting their markup.
  sections: {
    hero: true,
    details: true,
    rsvp: true,
    gifts: true,
    story: true,
    faq: true,
    contact: true
  }
};
