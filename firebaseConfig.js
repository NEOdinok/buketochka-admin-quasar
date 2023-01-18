import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCXBSHUNSYUor9IIHmWqSlt_hfSsCnvl18",
  authDomain: "buketochka-quasar-backend.firebaseapp.com",
  projectId: "buketochka-quasar-backend",
  storageBucket: "buketochka-quasar-backend.appspot.com",
  messagingSenderId: "604809262013",
  appId: "1:604809262013:web:706bf546ae5fdb1d7958d4"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth }
