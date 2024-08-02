"use client";

import { useEffect } from "react";

import { invoke } from "@tauri-apps/api/tauri";
import { RustFunctions } from "./enums";
import { useCountStore } from "@/store/countStore";

const Count = () => {
  const { count, setCount } = useCountStore();

  useEffect(() => {
    invoke<string>(RustFunctions.GetCount, {
      huntId: "050f5fe8-dfb4-4adb-a380-bae8c765ebe2",
    })
      .then((result) => {
        const data = JSON.parse(result);
        const updated_count = data[0].count;

        if (!isNaN(updated_count)) {
          setCount(updated_count);
        }
      })
      .catch(console.error);
  }, []);

  return <div>{count}</div>;
};

export default Count;
