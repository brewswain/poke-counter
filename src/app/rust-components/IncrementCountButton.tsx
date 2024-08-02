"use client";

import { invoke } from "@tauri-apps/api/tauri";
import { RustFunctions } from "./enums";
import { useCountStore } from "@/store/countStore";

const IncrementCountButton = () => {
  const { increment, incrementAmount, decrement } = useCountStore();

  const handleClick = async () => {
    increment();
    try {
      await invoke<string>(RustFunctions.UpdateCount, {
        huntId: "050f5fe8-dfb4-4adb-a380-bae8c765ebe2",
        count: incrementAmount.toString(),

        increment: true,
      });
    } catch (error) {
      console.error(error);
      decrement();
    }
  };

  return (
    <button
      className="bg-white text-black text-lg font-semibold rounded p-4"
      onClick={handleClick}
    >
      Increment
    </button>
  );
};

export default IncrementCountButton;
