"use client";

import { useCountStore } from "@/store/countStore";
import { CountChangeProps } from "@/types/interfaces";
import supabase from "@/utils/supabase";
import { invoke } from "@tauri-apps/api/tauri";

import { RustFunctions } from "./enums";

const DecrementCountButton = ({ huntId }: CountChangeProps) => {
  const { counts, setCount, incrementAmount } = useCountStore();

  const handleClick = async () => {
    const currentCount = counts[huntId] || 0;
    const newCount = Math.max(0, currentCount - 1);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Could not find session.");
    }

    if (!huntId) {
      throw new Error("Missing huntId.");
    }

    try {
      await invoke<string>(RustFunctions.UpdateCount, {
        huntId,
        accessToken: session.access_token,
        count: incrementAmount.toString(),
        increment: false,
      });
      setCount(huntId, newCount);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      className="rounded bg-white p-4 text-lg font-semibold text-black"
      onClick={handleClick}
    >
      Decrement
    </button>
  );
};

export default DecrementCountButton;
