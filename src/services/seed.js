// Loads the starting catalogue and About Us content into Firestore.
//
// Setup:
//   1. npm install -D firebase-admin
//   2. Firebase Console > Project settings > Service accounts > Generate new private key
//   3. Save it as serviceAccountKey.json in the project root (and add it to .gitignore!)
//   4. node scripts/seed.js
import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const products = [
  { id: 'c1', name: 'Assorted Muffins', category: 'Cakes', price: 200, badge: 'BESTSELLER', rating: 4.9, reviews: 28, image: '/images/cake-1.jpeg', description: 'Freshly baked assorted muffins' },
  { id: 'c2', name: 'Butter Biscuits', category: 'Cakes', price: 320, badge: 'POPULAR', rating: 4.8, reviews: 19, image: '/images/cake-2.jpeg', description: '"Melting moment" crispy biscuits.' },
  { id: 'c3', name: 'Banana Loaf', category: 'Cakes', price: 100, badge: 'NEW', rating: 4.7, reviews: 14, image: '/images/cake-3.jpeg', description: 'Freshly baked banana loaf.' },
  { id: 'c4', name: 'Layered Celebration Cake', category: 'Cakes', price: 300, badge: 'BESTSELLER', rating: 5.0, reviews: 42, image: '/images/cake-4.jpeg', description: 'Rich multi-layered sponge cake with whipped vanilla buttercream.' },
  { id: 'c5', name: 'Marble Cake', category: 'Cakes', price: 100, badge: null, rating: 4.9, reviews: 31, image: '/images/cake-5.jpeg', description: 'Freshly baked marble cake.' },
  { id: 'c6', name: 'Ginger Biscuits', category: 'Cakes', price: 250, badge: 'CUSTOM', rating: 4.8, reviews: 22, image: '/images/cake-6.jpeg', description: 'Crunchy and delicious ginger biscuits.' },
  { id: 'c7', name: 'Sponge Cake', category: 'Cakes', price: 300, badge: null, rating: 4.6, reviews: 18, image: '/images/cake-7.jpeg', description: 'Soft and delicate, yet satisfying.' }
];

const about = {
  businessName: 'Six Coach Confectionery',
  founder: 'Letta Mthiunye',
  story: [
    'Six Coach Confectionery is an independent artisanal bakery rooted in home-style craftsmanship. Founded by Letta Mthiunye, who started the business because she wanted to share the joy of homemade treats with her community.',
    'Every muffin, biscuit tin, and celebration cake is crafted in small batches using premium ingredients, ensuring that every bite feels genuinely homemade and crafted with love.'
  ],
  pillars: [
    { title: 'What We Do', text: 'We bake fresh cookies, muffins, banana loaves, marble cakes, and custom celebration cakes daily for personal treats and special events.' },
    { title: 'Why We Exist', text: 'To bring back the comforting feeling of opening a full, fresh tin of biscuits, bringing people together through memorable flavours.' },
    { title: 'Our Promise', text: 'Uncompromised quality, zero artificial preservatives, small-batch attention, and friendly service through WhatsApp.' }
  ],
  contact: {
    whatsapp: '27791901471',
    phoneDisplay: '+27 79 190 1471',
    email: '' // fill in the confirmed address
  }
};

async function seed() {
  const batch = db.batch();

  products.forEach(({ id, ...data }, index) => {
    batch.set(db.collection('products').doc(id), {
      ...data,
      isAvailable: true,
      sortOrder: index,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  batch.set(db.collection('siteContent').doc('about'), {
    ...about,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  await batch.commit();
  console.log(`Seeded ${products.length} products and the About Us content.`);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
