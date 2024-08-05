"use client";

import { Hunt } from "@/types/interfaces";
import supabase from "@/utils/supabase";

import { useEffect, useState } from "react";

import HuntCard from "@/components/hunts/HuntCard";

import { useGetAvailableHunts } from "./hookWrappers/rustWrappers";

const AvailableHunts = () => {
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const getHunts = useGetAvailableHunts();

  const fetchData = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      if (session) {
        const data = await getHunts({
          accessToken: session.access_token,
        });

        setHunts(data);
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      setHunts([]);
    };
  }, []);

  return (
    <div className="m-4 flex flex-wrap gap-2">
      {hunts && hunts.length
        ? hunts.map((hunt) => <HuntCard hunt={hunt} key={hunt.id} />)
        : null}
    </div>
  );
};

export default AvailableHunts;
