import { useCountStore } from "@/store/countStore";

import { useCallback, useRef, useState } from "react";

export const KeybindSettings = () => {
  const {
    incrementKeybind,
    decrementKeybind,
    setIncrementKeybind,
    setDecrementKeybind,
    setKeybindInputFocused,
  } = useCountStore();
  const [tempIncrement, setTempIncrement] = useState(
    incrementKeybind.join("+"),
  );
  const [tempDecrement, setTempDecrement] = useState(
    decrementKeybind.join("+"),
  );
  const incrementFocusRef = useRef(false);
  const decrementFocusRef = useRef(false);

  const handleKeyDown = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      focusRef: React.MutableRefObject<boolean>,
    ) =>
      (e: React.KeyboardEvent) => {
        e.preventDefault();
        const key = e.key;
        setter((prev) => {
          if (!focusRef.current) {
            focusRef.current = true;
            return key; // This will replace the initial value
          }
          // Only split and add if it's not the first keypress

          const keys = focusRef.current
            ? prev.split("+").filter((k) => k !== "")
            : [key];

          if (!keys.includes(key)) {
            return [...keys, key].join("+");
          }
          return prev;
        });
      },
    [],
  );

  const handleSave = () => {
    setIncrementKeybind(tempIncrement.split("+").filter((k) => k !== ""));
    setDecrementKeybind(tempDecrement.split("+").filter((k) => k !== ""));
  };
  const handleFocus =
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      focusRef: React.MutableRefObject<boolean>,
    ) =>
    () => {
      setter("");
      focusRef.current = false;
      setKeybindInputFocused(true);
    };

  const handleBlur = () => {
    setKeybindInputFocused(false);
  };
  const handleClear =
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      focusRef: React.MutableRefObject<boolean>,
    ) =>
    () => {
      setter("");
      focusRef.current = false;
    };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <input
          value={tempIncrement}
          onKeyDown={handleKeyDown(setTempIncrement, incrementFocusRef)}
          onFocus={handleFocus(setTempIncrement, incrementFocusRef)}
          onBlur={handleBlur}
          placeholder="Focus and press keys for increment"
          readOnly
        />
        <button onClick={handleClear(setTempIncrement, incrementFocusRef)}>
          Clear
        </button>
      </div>
      <div>
        <input
          value={tempDecrement}
          onKeyDown={handleKeyDown(setTempDecrement, decrementFocusRef)}
          onFocus={handleFocus(setTempDecrement, decrementFocusRef)}
          onBlur={handleBlur}
          placeholder="Focus and press keys for decrement"
          readOnly
        />
        <button onClick={handleClear(setTempDecrement, decrementFocusRef)}>
          Clear
        </button>
      </div>
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={handleSave}
      >
        Save Keybinds
      </button>
    </div>
  );
};
