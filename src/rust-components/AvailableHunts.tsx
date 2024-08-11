"use client";

import { Hunt } from "@/types/interfaces";
import supabase from "@/utils/supabase";

import { Suspense, useEffect, useState } from "react";

import HuntCard from "@/components/hunts/HuntCard";

import { useGetAvailableHunts } from "./hookWrappers/rustWrappers";

const HuntCardSkeleton = () => {
  return (
    <div className="flex max-w-[400px] flex-col items-center rounded bg-white p-4 animate-pulse">
      <div className="w-24 h-24 bg-gray-300 rounded-full mb-2"></div>
      <div className="w-3/4 h-4 bg-gray-300 rounded mb-2"></div>
      <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
    </div>
  );
};

const HuntList = ({ hunts }: { hunts: Hunt[] }) => {
  return (
    <>
      {hunts.map((hunt) => (
        <Suspense fallback={<HuntCardSkeleton />} key={hunt.id}>
          <HuntCard hunt={hunt} />
        </Suspense>
      ))}
    </>
  );
};
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

        console.log({ data });
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

  console.log({ hunts });

  return (
    <div className="m-4 flex flex-wrap gap-2">
      <Suspense fallback={<HuntCardSkeleton />}>
        <HuntList hunts={hunts} />
      </Suspense>
    </div>
  );
};

export default AvailableHunts;
