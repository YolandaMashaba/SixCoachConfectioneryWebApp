import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { db, auth, storage } from '../firebase';

const PRODUCTS = 'products';
const SITE_CONTENT = 'siteContent';

/* ---------------- Public (read-only) ---------------- */

// Returns the products the customer should see, in display order.
// Unavailable products are filtered here (not in the query) to avoid needing a composite index.
export async function getProducts({ includeUnavailable = false } = {}) {
  const snapshot = await getDocs(query(collection(db, PRODUCTS), orderBy('sortOrder')));
  const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  return includeUnavailable ? products : products.filter((p) => p.isAvailable !== false);
}

export async function getProduct(id) {
  const snap = await getDoc(doc(db, PRODUCTS, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// About Us / ethos content
export async function getAbout() {
  const snap = await getDoc(doc(db, SITE_CONTENT, 'about'));
  return snap.exists() ? snap.data() : null;
}

/* ---------------- Admin auth ---------------- */

export async function loginAdmin(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const token = await credential.user.getIdTokenResult(true);
  if (!token.claims.admin) {
    await signOut(auth);
    throw new Error('This account does not have admin access.');
  }
  return credential.user;
}

export const logoutAdmin = () => signOut(auth);

// Calls back with true/false whenever the signed-in user's admin status changes.
export function onAdminChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) return callback(false);
    const token = await user.getIdTokenResult();
    callback(token.claims.admin === true);
  });
}

/* ---------------- Admin (write) ---------------- */
// These only succeed for a signed-in admin because of firestore.rules / storage.rules.

export async function uploadProductImage(file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileRef = ref(storage, `products/${Date.now()}-${safeName}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

export async function addProduct(data) {
  return addDoc(collection(db, PRODUCTS), {
    badge: null,
    rating: 0,
    reviews: 0,
    isAvailable: true,
    ...data,
    sortOrder: Date.now(),
    createdAt: serverTimestamp()
  });
}

export const updateProduct = (id, data) => updateDoc(doc(db, PRODUCTS, id), data);

export async function deleteProduct(id, imageUrl) {
  await deleteDoc(doc(db, PRODUCTS, id));
  // Remove the uploaded image too (ignore images that are local files in /public/images)
  if (imageUrl && imageUrl.startsWith('http')) {
    try {
      await deleteObject(ref(storage, imageUrl));
    } catch {
      /* image already gone: nothing to do */
    }
  }
}

export const saveAbout = (data) =>
  setDoc(doc(db, SITE_CONTENT, 'about'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
