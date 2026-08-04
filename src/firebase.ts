import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import firebaseConfigJson from '../firebase-applet-config.json';

const userSuppliedConfig = {
  apiKey: "AIzaSyCXHpiJHbo-VNr3DXJn8_SxvTnIUHhRvLI",
  authDomain: "masud-telecom-9bc1e.firebaseapp.com",
  projectId: "masud-telecom-9bc1e",
  storageBucket: "masud-telecom-9bc1e.firebasestorage.app",
  messagingSenderId: "470904821560",
  appId: "1:470904821560:web:6631734fabc3cf0dc113cd",
  measurementId: "G-N73DK6BDJ6"
};

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey || userSuppliedConfig.apiKey,
  authDomain: firebaseConfigJson.authDomain || userSuppliedConfig.authDomain,
  projectId: firebaseConfigJson.projectId || userSuppliedConfig.projectId,
  storageBucket: firebaseConfigJson.storageBucket || userSuppliedConfig.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId || userSuppliedConfig.messagingSenderId,
  appId: firebaseConfigJson.appId || userSuppliedConfig.appId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore (using custom database ID if specified in config)
export const db = firebaseConfigJson.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
  : getFirestore(app);

export const storage = getStorage(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  deleteDoc,
  ref,
  uploadBytes,
  getDownloadURL
};
export type { FirebaseUser };
