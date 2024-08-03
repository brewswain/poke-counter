"use client";

import { invoke } from "@tauri-apps/api/tauri";
import { RustFunctions } from "./enums";
import { useCountStore } from "@/store/countStore";
import { CountChangeProps } from "@/types/interfaces";
import supabase from "@/utils/supabase";

const IncrementCountButton = ({ huntId }: CountChangeProps) => {
  const { increment, incrementAmount, decrement } = useCountStore();

  const handleClick = async () => {
    increment();

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
      const res = await invoke<string>(RustFunctions.UpdateCount, {
        huntId,
        count: incrementAmount.toString(),
        increment: true,
        accessToken: session.access_token,
      });

      console.log(JSON.parse(res));
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
