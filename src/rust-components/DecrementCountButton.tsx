"use client";

import { createHandleDecrement } from "@/lib/count/countUtils";
import { useCountStore } from "@/store/countStore";
import { CountChangeProps } from "@/types/interfaces";
import supabase from "@/utils/supabase";

import { useMemo } from "react";

import {
  useDecrementCount,
  useIncrementCount,
} from "./hookWrappers/rustWrappers";

const DecrementCountButton = ({ huntId }: CountChangeProps) => {
  const decrementCount = useDecrementCount();
  const countStore = useCountStore();
  const handleDecrement = useMemo(
    () => createHandleDecrement(decrementCount),
    [decrementCount],
  );
  return (
    <>
      <button
        className="rounded bg-white p-4 text-lg font-semibold text-black"
        onClick={() => handleDecrement(huntId, countStore)}
      >
        Decrement
      </button>
    </>
  );
};

export default DecrementCountButton;
