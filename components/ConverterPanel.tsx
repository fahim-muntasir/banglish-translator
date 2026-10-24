"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import TextInput from "@/components/TextInput";
import OutputCard from "@/components/OutputCard";
import { showLimitError, showError } from "@/lib/alert";
import SigninModal from "./SigninModal";
import { useAuth } from "@/context/AuthContext";
import { useUpgradePlan } from "@/context/UpgradeContext";
import { signInWithGoogle } from "@/lib/auth";
import PricingModal from "./PricingModal";
import StyleSelector from "./StyleSelector";
import { TranslationStyle } from "@/lib/conversionPrompts";
// import CreditsBar from "./CreditsBar";

export default function ConverterPanel() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const [pendingConversion, setPendingConversion] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<TranslationStyle>("casual");

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
    if (!inputText.trim() || isConverting || isTyping) return;

    if (!user) {
      setPendingConversion(true);
      setIsSigninModalOpen(true);
      return;
    }

    setIsConverting(true);

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    setOutputText("");

    try {
      const sendConversion = (idToken: string) =>
        fetch("/api/convert-to-banglish", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ text: inputText, style: selectedStyle }),
        });

      let res = await sendConversion(await user.getIdToken());
      if (res.status === 401) {
        res = await sendConversion(await user.getIdToken(true));
      }

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          showLimitError("Your conversion limit has been reached. Try again later or upgrade your plan!");
        } else {
          showError(data.error || "Conversion failed");
        }
        setIsConverting(false);
        return;
      }
      const converted = data.convertedText || "Conversion failed";

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
  }, [user, inputText, isConverting, isTyping, selectedStyle]);

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

      <StyleSelector
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
      />

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