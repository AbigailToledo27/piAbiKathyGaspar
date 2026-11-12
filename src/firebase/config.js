import app from 'firebase/app';
import firebase from 'firebase';


const firebaseConfig = {
  apiKey: "AIzaSyA6maIC1_RTMOpM5q2BLGikfmkPl9W_tt8",
  authDomain: "pi2-burgi-martinez-toledo.firebaseapp.com",
  projectId: "pi2-burgi-martinez-toledo",
  storageBucket: "pi2-burgi-martinez-toledo.firebasestorage.app",
  messagingSenderId: "452962364598",
  appId: "1:452962364598:web:a4f96571e5d2c3fe8dca17"
};

if (!app.apps.length) {
  app.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
