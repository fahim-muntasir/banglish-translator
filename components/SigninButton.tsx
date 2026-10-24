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

  if (user) return <UserProfileCard />;

  return (
    <button
      onClick={handleGoogleLogin}
      className="nb-chip fixed top-4 right-20 z-50 h-[46px] px-4 text-sm uppercase bg-secondary text-[#111]"
    >
      Sign In
    </button>
  );
};

export default SigninButton;