"use client";

import { Hunt } from "@/types/interfaces";
import supabase from "@/utils/supabase";
import { invoke } from "@tauri-apps/api/tauri";

import { useEffect, useState } from "react";

import HuntCard from "@/components/hunts/HuntCard";

import { RustFunctions } from "./enums";

const AvailableHunts = () => {
  const [hunts, setHunts] = useState<Hunt[]>([]);

  const fetchData = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      if (session) {
        invoke<string>(RustFunctions.GetAvailableHunts, {
          accessToken: session.access_token,
        })
          .then((result) => {
            const data: Hunt[] = JSON.parse(result);
            setHunts(data);
          })
          .catch(console.error);
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
    <div className="m-4 flex gap-2">
      {hunts && hunts.length
        ? hunts.map((hunt) => <HuntCard hunt={hunt} key={hunt.id} />)
        : null}
    </div>
  );
};

export default AvailableHunts;
