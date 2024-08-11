"use client";

import { useCountStore } from "@/store/countStore";
import { CountChangeProps } from "@/types/interfaces";
import supabase from "@/utils/supabase";

import { useIncrementCount } from "./hookWrappers/rustWrappers";

const IncrementCountButton = ({ huntId }: CountChangeProps) => {
  const { counts, setCount, incrementAmount } = useCountStore();
  const incrementCount = useIncrementCount();

  const handleClick = async () => {
    const currentCount = counts[huntId] || 0;
    const newCount = currentCount + incrementAmount;
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
      await incrementCount({
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
        Increment
      </button>
    </>
  );
};

export default IncrementCountButton;
