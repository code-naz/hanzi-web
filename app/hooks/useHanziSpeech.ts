"use client";

import { useCallback, useEffect, useState } from "react";

export function useHanziSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (!text.trim()) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.92;
      utterance.pitch = 1;
      utterance.volume = 1;

      const chineseVoice =
        voices.find((voice) => voice.lang?.toLowerCase().startsWith("zh")) ||
        voices.find((voice) => /chinese|mandarin|中文/i.test(voice.name));

      if (chineseVoice) {
        utterance.voice = chineseVoice;
      }

      window.speechSynthesis.speak(utterance);
    },
    [voices]
  );

  return { speak };
}