"use client";

import { useCountStore } from "@/store/countStore";
import { CountChangeProps } from "@/types/interfaces";
import supabase from "@/utils/supabase";
import { invoke } from "@tauri-apps/api/tauri";

import { RustFunctions } from "./enums";

const DecrementCountButton = ({ huntId }: CountChangeProps) => {
  const { increment, incrementAmount, decrement } = useCountStore();

  const handleClick = async () => {
    decrement();

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
    } catch (error) {
      console.error(error);
      increment();
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
