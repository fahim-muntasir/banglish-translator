"use client";

import { signInWithGoogle } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import UserProfileCard from "./UserProfileCard";

const SigninButton = () => {
  const { user } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  if (user) {
    return <UserProfileCard />;
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="fixed text-sm top-4 right-20 z-50 p-3 rounded-xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg hover:scale-105 active:scale-95 transition-all"
    >
      Sign In
    </button>
  );
};

export default SigninButton;
