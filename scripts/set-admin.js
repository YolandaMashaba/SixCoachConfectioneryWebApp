// Gives one user the admin role (custom claim).
//
// 1. In Firebase Console > Authentication, add the owner as an Email/Password user.
// 2. Run:  node scripts/set-admin.js owner@example.com
// 3. The user must sign out and back in for the claim to take effect.
import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/set-admin.js <email>');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

try {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`${email} is now an admin.`);
} catch (err) {
  console.error('Could not set admin claim:', err.message);
  process.exit(1);
}
