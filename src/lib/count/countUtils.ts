import { CountState, useCountStore } from "@/store/countStore";
import supabase from "@/utils/supabase";

import {
  useDecrementCount,
  useIncrementCount,
} from "@/rust-components/hookWrappers/rustWrappers";

export const createHandleIncrement =
  (incrementCount: ReturnType<typeof useIncrementCount>) =>
  async (huntId: string, countStore: CountState) => {
    console.log({ huntId });
    const { counts, setCount, incrementAmount } = countStore;
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
      setCount(huntId, newCount);
      await incrementCount({
        huntId,
        accessToken: session.access_token,
        count: incrementAmount.toString(),
      });
    } catch (error) {
      console.error(error);
    }
  };

export const createHandleDecrement =
  (decrementCount: ReturnType<typeof useDecrementCount>) =>
  async (huntId: string, countStore: CountState) => {
    const { counts, setCount, incrementAmount } = countStore;
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
      setCount(huntId, newCount);
      await decrementCount({
        huntId,
        accessToken: session.access_token,
        count: incrementAmount.toString(),
      });
    } catch (error) {
      console.error(error);
    }
  };
