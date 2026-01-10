"use client";

import { useState, useCallback } from "react";
import TextInput from "@/components/TextInput";
import OutputCard from "@/components/OutputCard";
import { canUserConvert, increaseUsage } from "@/lib/usageLimit";
import { showLimitError, showError } from "@/lib/alert";

export default function ConverterPanel() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleConvert = useCallback(async () => {
    if (!inputText.trim()) return;

    if (!canUserConvert()) {
      showLimitError();
      return;
    }

    increaseUsage();

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
        return;
      }

      const data = await res.json();

      const converted = data.convertedText || "[Banglish conversion failed]";

      // Typing animation
      setIsConverting(false);
      setIsTyping(true);

      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= converted.length) {
          setOutputText(converted.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 20);

    } catch (err) {
      console.error(err);
      showError("❌ An error occurred while converting the text.");
      setOutputText("[Banglish conversion failed]");
      setIsConverting(false);
      setIsTyping(false);
    }
  }, [inputText]);

  const handleClear = useCallback(() => {
    setInputText("");
    setOutputText("");
  }, []);

  return (
    <>
      <TextInput
        onSubmit={handleConvert}
        isLoading={isConverting}
        disabled={!inputText.trim()}
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
