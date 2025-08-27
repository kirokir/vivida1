import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDsWxcyWU_PZOgEJ33tn-T529o8Ykyfims",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "kkjj-c3ef7"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kkjj-c3ef7",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "kkjj-c3ef7"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:922171924383:web:3ea9e9c3e0ee77a0dda7aa",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithRedirect(auth, googleProvider);
};

export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      const idToken = await user.getIdToken();
      
      // Send to backend for verification and JWT creation
      const response = await fetch("/api/auth/firebase-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        return data;
      }
    }
    return null;
  } catch (error) {
    console.error("Error handling redirect result:", error);
    throw error;
  }
};
