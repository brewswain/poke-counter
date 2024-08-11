import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CountState {
  counts: { [huntId: string]: number };
  setCount: (huntId: string, count: number) => void;
  incrementAmount: number;
  setIncrementAmount: (amount: number) => void;
  incrementCount: (huntId: string) => void;
  decrementCount: (huntId: string) => void;
  incrementKeybind: string[];
  decrementKeybind: string[];
  setIncrementKeybind: (keys: string[]) => void;
  setDecrementKeybind: (keys: string[]) => void;
  isKeybindInputFocused: boolean;
  setKeybindInputFocused: (isFocused: boolean) => void;
}

export const useCountStore = create(
  persist<CountState>(
    (set) => ({
      counts: {},
      setCount: (huntId, count) =>
        set((state) => ({
          counts: { ...state.counts, [huntId]: count },
        })),
      incrementAmount: 1,
      setIncrementAmount: (amount) => set({ incrementAmount: amount }),
      incrementCount: (huntId) =>
        set((state) => ({
          counts: {
            ...state.counts,
            [huntId]: (state.counts[huntId] || 0) + state.incrementAmount,
          },
        })),
      decrementCount: (huntId) =>
        set((state) => ({
          counts: {
            ...state.counts,
            [huntId]: (state.counts[huntId] || 0) - state.incrementAmount,
          },
        })),
      incrementKeybind: ["ArrowUp"],
      decrementKeybind: ["ArrowDown"],
      setIncrementKeybind: (keys) => set({ incrementKeybind: keys }),
      setDecrementKeybind: (keys) => set({ decrementKeybind: keys }),
      isKeybindInputFocused: false,
      setKeybindInputFocused: (isFocused: boolean) =>
        set({ isKeybindInputFocused: isFocused }),
    }),
    {
      name: "count-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
