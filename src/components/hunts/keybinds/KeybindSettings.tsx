import { useCountStore } from "@/store/countStore";
import supabase from "@/utils/supabase";

import { useCallback, useRef, useState } from "react";

import { useUpdateHuntKeybinds } from "@/rust-components/hookWrappers/rustWrappers";

export const KeybindSettings = ({ huntId }: { huntId: string }) => {
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

  const updateHuntKeybinds = useUpdateHuntKeybinds();
  const handleKeyDown = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      focusRef: React.MutableRefObject<boolean>,
    ) =>
      (e: React.KeyboardEvent) => {
        e.preventDefault();
        const key = e.key;

        if (key === "Escape") {
          setter(
            setter === setTempIncrement
              ? incrementKeybind.join("+")
              : decrementKeybind.join("+"),
          );
          focusRef.current = false;
          (e.currentTarget as HTMLElement).blur();
          return;
        }

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

  const handleSave = async () => {
    setIncrementKeybind(tempIncrement.split("+").filter((k) => k !== ""));
    setDecrementKeybind(tempDecrement.split("+").filter((k) => k !== ""));

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Could not find session.");
    }
    await updateHuntKeybinds({
      huntId,
      incrementKeybind: tempIncrement.split("+").filter((k) => k !== ""),
      decrementKeybind: tempDecrement.split("+").filter((k) => k !== ""),
      accessToken: session.access_token,
    });
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
