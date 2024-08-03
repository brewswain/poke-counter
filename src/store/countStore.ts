import { create } from "zustand";

interface CountState {
  counts: { [huntId: string]: number };
  setCount: (huntId: string, count: number) => void;
  incrementAmount: number;
  setIncrementAmount: (amount: number) => void;
  incrementCount: (huntId: string) => void;
  decrementCount: (huntId: string) => void;
}

export const useCountStore = create<CountState>((set) => ({
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
}));
