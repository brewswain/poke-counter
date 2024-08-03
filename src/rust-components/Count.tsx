"use client";

import { useCountStore } from "@/store/countStore";
import supabase from "@/utils/supabase";
import { invoke } from "@tauri-apps/api/tauri";

import { useEffect } from "react";

import { RustFunctions } from "./enums";

const Count = ({ huntId }: { initial_count: number; huntId: string }) => {
  const { count, setCount } = useCountStore();

  const fetchData = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      if (session) {
        invoke<string>(RustFunctions.GetCount, {
          huntId,
          accessToken: session.access_token,
        })
          .then((result) => {
            const data = JSON.parse(result);
            const updated_count = data[0].count;

            if (!isNaN(updated_count)) {
              setCount(updated_count);
            }
          })
          .catch(console.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      setCount(0);
    };
  }, []);

  return <div className="text-black">Count: {count}</div>;
};

export default Count;
