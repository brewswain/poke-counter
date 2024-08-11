import {
  createHandleDecrement,
  createHandleIncrement,
} from "@/lib/count/countUtils";
import { useCountStore } from "@/store/countStore";

import { useEffect, useState } from "react";

import {
  useDecrementCount,
  useIncrementCount,
} from "@/rust-components/hookWrappers/rustWrappers";

const KeybindHandler = ({ huntId }: { huntId: string }) => {
  const countStore = useCountStore();
  const { incrementKeybind, decrementKeybind, isKeybindInputFocused } =
    countStore;
  const [pressedKeys, setPressedKeys] = useState(new Set<string>());

  const incrementCount = useIncrementCount();
  const decrementCount = useDecrementCount();

  const handleIncrement = createHandleIncrement(incrementCount);
  const handleDecrement = createHandleDecrement(decrementCount);

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
      if (isKeybindInputFocused) return;

      if (incrementKeybind.every((key) => pressedKeys.has(key))) {
        handleIncrement(huntId, countStore);
      } else if (decrementKeybind.every((key) => pressedKeys.has(key))) {
        handleDecrement(huntId, countStore);
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
    handleIncrement,
    handleDecrement,
    pressedKeys,
    countStore,
  ]);

  return null;
};

export default KeybindHandler;
