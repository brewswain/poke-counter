import create from "zustand";

interface CountState {
  count: number;
  incrementAmount: number;
  setCount: (count: number) => void;
  setIncrementAmount: (amount: number) => void;
  increment: () => void;
  decrement: () => void;
}

export const useCountStore = create<CountState>((set) => ({
  count: 0,
  incrementAmount: 1,
  setCount: (count) => set({ count }),
  setIncrementAmount: (amount) => set({ incrementAmount: amount }),
  increment: () =>
    set((state) => ({ count: state.count + state.incrementAmount })),
  decrement: () =>
    set((state) => ({ count: state.count - state.incrementAmount })),
}));
