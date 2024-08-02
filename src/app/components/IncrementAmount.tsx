"use client";

import { useCountStore } from "../../store/countStore";

const IncrementAmount = () => {
  const { incrementAmount, setIncrementAmount } = useCountStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setIncrementAmount(value);
    }
  };

  return (
    <input
      type="number"
      min="1"
      value={incrementAmount}
      onChange={handleChange}
      className="bg-white text-black text-lg font-semibold rounded p-2"
    />
  );
};

export default IncrementAmount;
