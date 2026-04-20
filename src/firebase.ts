import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigRaw from '../firebase-applet-config.json';

const firebaseConfig = {
  ...firebaseConfigRaw,
  apiKey: (firebaseConfigRaw as any).apiKey || ((firebaseConfigRaw as any).apiKeyP1 + (firebaseConfigRaw as any).apiKeyP2)
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
