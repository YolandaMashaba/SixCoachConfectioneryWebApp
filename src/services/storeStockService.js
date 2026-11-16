import { getApps, initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';

const stockFirebaseConfig = {
  apiKey: import.meta.env.VITE_STOCK_FIREBASE_API_KEY,
  appId: import.meta.env.VITE_STOCK_FIREBASE_APP_ID,
  projectId: import.meta.env.VITE_STOCK_FIREBASE_PROJECT_ID
};

export const isStoreStockConfigured = () =>
  Object.values(stockFirebaseConfig).every(Boolean);

function getStockDatabase() {
  const app = getApps().find((existingApp) => existingApp.name === 'storeStock')
    ?? initializeApp(stockFirebaseConfig, 'storeStock');
  return getFirestore(app);
}

export function subscribeToStoreStock(onUpdate, onError) {
  return onSnapshot(collection(getStockDatabase(), 'publicStock'), (snapshot) => {
    const stockByProductId = {};

    snapshot.docs.forEach((stockDocument) => {
      const { productId, quantityInStock } = stockDocument.data();
      if (
        typeof productId === 'string'
        && Number.isFinite(quantityInStock)
        && quantityInStock >= 0
      ) {
        stockByProductId[productId] = quantityInStock > 0;
      }
    });

    onUpdate(stockByProductId);
  }, onError);
}
