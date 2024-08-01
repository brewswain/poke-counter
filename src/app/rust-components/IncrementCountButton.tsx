"use client";

import { invoke } from "@tauri-apps/api/tauri";
import { RustFunctions } from "./enums";

const IncrementCountButton = () => {
  const handleClick = async () => {
    try {
      await invoke<string>(RustFunctions.UpdateCount, {
        huntId: "050f5fe8-dfb4-4adb-a380-bae8c765ebe2",
        count: "3",
        increment: true,
      });
    } catch (error) {
      console.error(error);
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
