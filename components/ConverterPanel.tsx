"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import TextInput from "@/components/TextInput";
import OutputCard from "@/components/OutputCard";
import { canUserConvert, increaseUsage } from "@/lib/usageLimit";
import { showLimitError, showError } from "@/lib/alert";

export default function ConverterPanel() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  const handleConvert = useCallback(async () => {
    if (!inputText.trim() || isConverting || isTyping) return;

    if (!canUserConvert()) {
      showLimitError();
      return;
    }

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    setIsConverting(true);
    setOutputText("");

    try {
      const res = await fetch("/api/convert-to-banglish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!res.ok) {
        showError("Server error. Please try again.");
        setIsConverting(false);
        return;
      }

      const data = await res.json();
      const converted = data.convertedText || "[Banglish conversion failed]";

      increaseUsage(); // Increase usage only after successful fetch
      setIsConverting(false);
      setIsTyping(true);

      let currentIndex = 0;

      typingTimerRef.current = setInterval(() => {
        if (currentIndex <= converted.length) {
          setOutputText(converted.slice(0, currentIndex));
          currentIndex++;
        } else {
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
          setIsTyping(false);
        }
      }, 15);

    } catch (err) {
      console.error(err);
      showError("❌ An error occurred while converting the text.");
      setOutputText("[Banglish conversion failed]");
      setIsConverting(false);
      setIsTyping(false);
    }
  }, [inputText, isConverting, isTyping]);

  const handleClear = useCallback(() => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setInputText("");
    setOutputText("");
    setIsTyping(false);
  }, []);

  return (
    <>
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
    </>
  );
}