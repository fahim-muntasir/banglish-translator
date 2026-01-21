"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import TextInput from "@/components/TextInput";
import OutputCard from "@/components/OutputCard";
import { canUserConvert, increaseUsage } from "@/lib/usageLimit";
import { showLimitError, showError } from "@/lib/alert";
import SigninModal from "./SigninModal";
import { useAuth } from "@/context/AuthContext";
import { useUpgradePlan } from "@/context/UpgradeContext";
import { signInWithGoogle } from "@/lib/auth";
import PricingModal from "./PricingModal";
// import CreditsBar from "./CreditsBar";

export default function ConverterPanel() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const [pendingConversion, setPendingConversion] = useState(false);

  const { user } = useAuth();
  const { isPricingModalOpen, setIsPricingModalOpen } = useUpgradePlan();

  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (user && isSigninModalOpen) {
      setIsSigninModalOpen(false);
    }
  }, [user, isSigninModalOpen]);


  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleConvert = useCallback(async () => {
    setIsConverting(true);

    if (!user) {
      setPendingConversion(true);
      setIsSigninModalOpen(true);
      return;
    }

    if (!inputText.trim() || isConverting || isTyping) return;

    const result = await canUserConvert(user.uid);

    if (!result.allowed) {
      if (result.reason === "DAILY_LIMIT") {
        showLimitError("Daily limit reached. Try again tomorrow!");
      }

      if (result.reason === "MONTHLY_LIMIT") {
        showLimitError("Monthly limit reached. Upgrade your plan!");
      }

      setIsConverting(false);
      return;
    }


    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    setOutputText("");

    try {
      const res = await fetch("/api/convert-to-banglish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await res.json();
      const converted = data.convertedText || "Conversion failed";

      // Increase usage count
      await increaseUsage(user.uid);

      setIsTyping(true);
      setIsConverting(false);

      let i = 0;
      typingTimerRef.current = setInterval(() => {
        if (i <= converted.length) {
          setOutputText(converted.slice(0, i));
          i++;
        } else {
          clearInterval(typingTimerRef.current!);
          setIsTyping(false);
        }
      }, 15);
    } catch {
      setIsConverting(false);
      showError("Something went wrong");
    }
  }, [user, inputText, isConverting, isTyping]);

  useEffect(() => {
    if (!user || !pendingConversion) return;

    setPendingConversion(false);

    setTimeout(() => {
      handleConvert();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pendingConversion]);

  const handleClear = useCallback(() => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setInputText("");
    setOutputText("");
    setIsTyping(false);
  }, []);

  return (
    <>
      {/* <CreditsBar creditsLeft={100} onUpgrade={() => {}} /> */}

      <TextInput
        onSubmit={handleConvert}
        isLoading={isConverting}
        disabled={!inputText.trim() || isTyping}
        value={inputText}
        onChange={setInputText}
      />

      <OutputCard
        output={outputText}
        isTyping={isTyping}
        onClear={handleClear}
      />

      <SigninModal open={isSigninModalOpen} onOpenChange={setIsSigninModalOpen} handleGoogleLogin={handleGoogleLogin} />

      <PricingModal open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen} />
    </>
  );
}