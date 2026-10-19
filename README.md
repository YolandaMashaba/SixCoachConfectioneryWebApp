#  Six Coach Confectionery Web Application

A professional, responsive artisanal bakery storefront and catalog web application built for **Six Coach Confectionery**, featuring dynamic Firebase integration, product filtering, a custom cake options modal, and a seamless WhatsApp-driven ordering flow.

---

##  Key Features

* **Interactive Product Catalog**: Browse home-baked treats, biscuits, muffins, and celebration cakes with real-time search filtering and sorting (by price or rating).
* **Customization Modal**: Tailor custom cakes with size options, sponge/filling flavor choices, and personalized cake board inscriptions.
* **Direct WhatsApp Ordering**: Streamlined checkout workflow that pre-fills itemized product details, quantities, and custom options into a direct WhatsApp message.
* **About Us Page**: Highlights the brand's heritage, founder Letta Mthimunye, location (Roodepoort, Gauteng, South Africa), core pillars, and quality promises.
* **Firebase Backend Integration**: Powered by Cloud Firestore, Firebase Auth, and Firebase Storage via a robust service layer (`catalogueService.js`) for dynamic content management.
* **Expanded Footer**: Includes newsletter subscription, baking and collection hours, order notice guidelines, and direct contact options.

---

##  Tech Stack

* **Frontend**: React (Vite), JavaScript, Tailwind CSS
* **Icons**: Lucide React
* **Backend & Database**: Firebase (Cloud Firestore, Authentication, Firebase Storage)
* **CI/CD**: GitHub Actions for automated building and testing

---

##  Project Structure

```text
SixCoachConfectioneryWebApp-1/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI pipeline
├── public/
│   └── images/                # Product and logo asset images
├── src/
│   ├── services/
│   │   └── catalogueService.js # Firebase service layer for products & about page
│   ├── App.jsx                # Main application component & UI views
│   ├── main.jsx               # React entry point
│   └── firebase.js            # Firebase app initialization
├── .env.example               # Environment variables template
├── firestore.rules            # Firebase Firestore security rules
├── package.json
└── vite.config.js
