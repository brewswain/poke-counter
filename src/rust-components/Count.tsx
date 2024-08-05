"use client";

import { useCountStore } from "@/store/countStore";
import supabase from "@/utils/supabase";

import { useEffect } from "react";

import { useGetCount } from "./hookWrappers/rustWrappers";

const Count = ({ huntId }: { huntId: string }) => {
  const { counts, setCount } = useCountStore();
  const getCount = useGetCount();

  const fetchData = async () => {
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

  return <div className="text-black">Count: {counts[huntId]}</div>;
};

export default Count;
