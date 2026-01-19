import { signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      provider: "google",

      plan: "free",
      planStartedAt: null,
      planExpiresAt: null,

      dailyUsage: 0,
      dailyLimit: 20,
      lastUsageReset: serverTimestamp(),

      totalTranslations: 0,
      isBlocked: false,

      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  );

  return user;
};

export const logout = async () => {
  await signOut(auth);
};

