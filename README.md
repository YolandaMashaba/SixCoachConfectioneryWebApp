# Six Coach Confectionery

An artisanal online bakery catalogue built for **Six Coach Confectionery**, founded by Letta Mthimunye. The platform enables customers to explore fresh home-baked cookies, muffins, cakes, and custom confectionery treats, with direct ordering and enquiry routing via WhatsApp.
---

## Features

- **Dynamic Product Catalogue:** Real-time fetching of products and categories powered by Firebase Firestore.
- **Search & Filtering:** Live text search and multi-criteria sorting (Price: Low/High, Rating, Latest).
- **Direct WhatsApp Ordering:** Instant pre-filled order enquiries sent directly to the baker's WhatsApp.
- **About Us & Ethos Section:** Highlights brand story, values, and business contact information.
- **Responsive & Modern Design:** Tailored with Tailwind CSS for seamless mobile and desktop browsing.
- **Admin & Firebase Cloud Infrastructure:** Firestore security rules and configuration ready for production deployment.

---

Deployment link: sixcoachconfectionerywebapp.vercel.app

## Tech Stack

- **Frontend:** React, Tailwind CSS, Lucide React (Icons), Vite
- **Backend / Database:** Firebase (Cloud Firestore, Authentication, Firebase Storage)
- **Deployment & Hosting:** Firebase / Vercel / Netlify ready

---

## Project Structure

```text
SixCoachConfectioneryWebApp-1/
├── public/
│   └── images/              # Static product and logo images
├── src/
│   ├── assets/              # Static assets and icons
│   ├── services/
│   │   ├── firebase.js      # Firebase initialization & SDK exports
│   │   └── catalogueService.js # Firestore CRUD operations for products & site content
│   ├── App.jsx              # Main UI & Application Router
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind & global styles
├── .env                     # Local environment variables (do not commit)
├── env.example              # Environment variable template
├── firestore.rules          # Security rules for Cloud Firestore
├── seed.js                  # Database initial seeding script
├── package.json             # Dependencies and npm scripts
└── vite.config.js           # Vite configuration
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (comes bundled with Node.js)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/SixCoachConfectioneryWebApp.git
cd SixCoachConfectioneryWebApp
```

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the root folder by copying the `env.example` template:

```bash
cp env.example .env
```

Open `.env` and fill in your Firebase Web App credentials obtained from your [Firebase Console](https://console.firebase.google.com/) (**Project Settings > General > Your Apps**):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

### 4. Seed the Firestore Database

To populate your Cloud Firestore database with initial sample products and site information:

1. Ensure your `.env` credentials are correctly configured.
2. Run the seed script:

```bash
node seed.js
```

---

### 5. Run the Application Locally

Start the local Vite development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the URL provided in your terminal) to view the application live.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server |
| `npm run build` | Builds the app for production |
| `npm run preview` | Previews the production build locally |
| `node seed.js` | Populates Firestore with seed product data |

---

## Security Rules

Deploy your Firestore rules to Firebase using the CLI or via the Firebase Console:

```bash
firebase deploy --only firestore:rules
```

---

## Contact & Support

- **Business Name:** Six Coach Confectionery
- **Founder:** Letta Mthimunye
- **Location:** Roodepoort, Gauteng, South Africa
- **WhatsApp / Call:** +27 79 190 1471
- **Email:** zwanefistos88@gmail.com
