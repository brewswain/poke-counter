"use client";

import { useCountStore } from "@/store/countStore";
import supabase from "@/utils/supabase";

import { Suspense, useEffect } from "react";

import { useGetCount } from "./hookWrappers/rustWrappers";

const Count = ({ count, huntId }: { count: number; huntId: string }) => {
  const { counts, setCount } = useCountStore();
  const getCount = useGetCount();

  const fetchData = async () => {
    // setCount(huntId, count);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      if (session) {
        const data = await getCount({
          huntId,
          accessToken: session.access_token,
        });
        const updated_count = data[0].count;

        if (!isNaN(updated_count)) {
          setCount(huntId, updated_count);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <div className="text-black">Count: {counts[huntId] | 0}</div>;
};

export default Count;
