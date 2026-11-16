import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase.js';

const ENQUIRIES = 'enquiries';

export async function submitEnquiry(enquiry) {
  if (!import.meta.env.VITE_FIREBASE_API_KEY || !import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    throw new Error('Firebase environment variables are not configured.');
  }

  return addDoc(collection(db, ENQUIRIES), {
    ...enquiry,
    createdAt: serverTimestamp()
  });
}
