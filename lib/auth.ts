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
      plan: "FREE",
      
      dailyUsage: 0,
      lastUsageReset: serverTimestamp(),

      totalTranslations: 0,
      isBlocked: false,
      
      usage: {
        count: 0,
        resetAt: serverTimestamp(),
      },
    },
    { merge: true },
  );

  return user;
};

export const logout = async () => {
  await signOut(auth);
};
