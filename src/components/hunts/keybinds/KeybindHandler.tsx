"use client";

import { useCountStore } from "@/store/countStore";

import { useEffect, useState } from "react";

const KeybindHandler = ({ huntId }: { huntId: string }) => {
  const {
    incrementKeybind,
    decrementKeybind,
    incrementCount,
    decrementCount,
    isKeybindInputFocused,
  } = useCountStore();
  const [pressedKeys, setPressedKeys] = useState(new Set<string>());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPressedKeys((prev) => new Set(prev).add(event.key));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      checkKeybinds();
      setPressedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(event.key);
        return newSet;
      });
    };

    const checkKeybinds = () => {
      if (isKeybindInputFocused) return; // Don't increment/decrement if keybind input is focused

      if (incrementKeybind.every((key) => pressedKeys.has(key))) {
        incrementCount(huntId);
      } else if (decrementKeybind.every((key) => pressedKeys.has(key))) {
        decrementCount(huntId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keydown", checkKeybinds);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", checkKeybinds);
    };
  }, [
    huntId,
    isKeybindInputFocused,
    incrementKeybind,
    decrementKeybind,
    incrementCount,
    decrementCount,
    pressedKeys,
  ]);

  return null;
};

export default KeybindHandler;
