"use client";

import { createHandleIncrement } from "@/lib/count/countUtils";
import { useCountStore } from "@/store/countStore";
import { CountChangeProps } from "@/types/interfaces";
import supabase from "@/utils/supabase";

import { useMemo } from "react";

import { useIncrementCount } from "./hookWrappers/rustWrappers";

const IncrementCountButton = ({ huntId }: CountChangeProps) => {
  const incrementCount = useIncrementCount();
  const countStore = useCountStore();
  const handleIncrement = useMemo(
    () => createHandleIncrement(incrementCount),
    [incrementCount],
  );

  return (
    <>
      <button
        className="rounded bg-white p-4 text-lg font-semibold text-black"
        onClick={() => handleIncrement(huntId, countStore)}
      >
        Increment
      </button>
    </>
  );
};

export default IncrementCountButton;
