"use client";

import { useCountStore } from "@/store/countStore";
import { CountChangeProps } from "@/types/interfaces";
import supabase from "@/utils/supabase";

import KeybindHandler from "@/components/hunts/keybinds/KeybindHandler";

import { useDecrementCount } from "./hookWrappers/rustWrappers";

const DecrementCountButton = ({ huntId }: CountChangeProps) => {
  const { counts, setCount, incrementAmount } = useCountStore();

  const decrementCount = useDecrementCount();

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
      await decrementCount({
        huntId,
        accessToken: session.access_token,
        count: incrementAmount.toString(),
      });

      setCount(huntId, newCount);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button
        className="rounded bg-white p-4 text-lg font-semibold text-black"
        onClick={handleClick}
      >
        Decrement
      </button>
    </>
  );
};

export default DecrementCountButton;
